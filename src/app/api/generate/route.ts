import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SCORMGenerateData } from '@/lib/scormService';

// OpenAI istemcisi (sunucu tarafında)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// API anahtarını kontrol et
const isOpenAIConfigured = (): boolean => {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_KEY !== 'your_openai_api_key_here';
};

// Profesyonel içerik oluşturma fonksiyonu
const generateProfessionalContent = (data: SCORMGenerateData): string => {
  const difficulty = data.difficultyLevel === 'beginner' 
    ? 'başlangıç seviyesi' 
    : data.difficultyLevel === 'intermediate' 
      ? 'orta seviye' 
      : 'ileri seviye';

  const learningObjectives = data.learningObjectives
    ? data.learningObjectives.split('\n').filter(obj => obj.trim())
    : ['Bu içeriği tamamladığınızda konuyu tam olarak anlamış olacaksınız.'];

  let content = `
    <div class="content-section">
      <h2>Giriş</h2>
      <p>Bu eğitim içeriği <strong>${data.title}</strong> konusunu kapsamaktadır. İçerik ${difficulty} seviyesinde hazırlanmıştır.</p>
      ${data.targetAudience ? `<p><strong>Hedef Kitle:</strong> ${data.targetAudience}</p>` : ''}
    </div>

    <div class="content-section">
      <h2>İçerik</h2>
      <p>${data.prompt}</p>
      
      <h3>Ana Konular</h3>
      <ul>
        <li>Konu 1: Temel kavramlar ve tanımlar</li>
        <li>Konu 2: Uygulama örnekleri</li>
        <li>Konu 3: Pratik alıştırmalar</li>
        <li>Konu 4: Değerlendirme ve özet</li>
      </ul>
      
      <h3>Detaylı Açıklama</h3>
      <p>Bu bölümde ${data.title} konusunu detaylı olarak inceleyeceğiz. Konu, ${difficulty} seviyesinde öğrenciler için uygun şekilde hazırlanmıştır.</p>
      
      <div class="highlight-box">
        <h4>Önemli Not</h4>
        <p>Bu içerik SCORM standartlarına uygun olarak hazırlanmıştır ve LMS sistemlerinizde sorunsuz çalışacaktır.</p>
      </div>
    </div>
  `;

  // Quiz ekleme
  if (data.includeQuiz && data.numberOfQuestions) {
    content += `
      <div class="quiz-section">
        <h2>Değerlendirme</h2>
        <p>Aşağıdaki soruları yanıtlayarak öğrendiklerinizi test edebilirsiniz.</p>
    `;
    
    for (let i = 1; i <= Math.min(data.numberOfQuestions, 5); i++) {
      content += `
        <div class="quiz-question">
          <h4>Soru ${i}:</h4>
          <p>${data.title} konusu ile ilgili örnek soru ${i}?</p>
          <ul class="options">
            <li>A) Seçenek A</li>
            <li>B) Seçenek B</li>
            <li>C) Seçenek C</li>
            <li>D) Seçenek D</li>
          </ul>
        </div>
      `;
    }
    
    content += `</div>`;
  }

  return content;
};

export async function POST(request: Request) {
  try {
    // İstek gövdesini al ve doğrula
    const data: SCORMGenerateData = await request.json();
    
    // Gerekli alanları kontrol et
    if (!data.title || !data.prompt) {
      return NextResponse.json(
        { error: "Başlık ve içerik açıklaması zorunludur." },
        { status: 400 }
      );
    }

    let content: string;

    // OpenAI API anahtarı yapılandırılmışsa kullan
    if (isOpenAIConfigured()) {
      try {
        // Öğrenme hedeflerini biçimlendir
        const learningObjectives = data.learningObjectives
          ? data.learningObjectives.split('\n').map(obj => `- ${obj}`).join('\n')
          : '';
        
        // Zorluk seviyesi
        const difficulty = data.difficultyLevel === 'beginner' 
          ? 'başlangıç seviyesi' 
          : data.difficultyLevel === 'intermediate' 
            ? 'orta seviye' 
            : 'ileri seviye';
        
        // Quiz içeriği için istek
        let quizPrompt = '';
        if (data.includeQuiz && data.numberOfQuestions) {
          quizPrompt = `
Ayrıca, ${data.numberOfQuestions} adet soru içeren bir quiz bölümü ekle. Her soru için 4 seçenek olmalı ve doğru cevabı belirtmelisin.
          `;
        }

        // İçerik türüne göre istek oluştur
        let contentTypePrompt = '';
        switch (data.contentType) {
          case 'course':
            contentTypePrompt = 'Bir eğitim kursu içeriği';
            break;
          case 'quiz':
            contentTypePrompt = 'Bir quiz/sınav içeriği';
            break;
          case 'presentation':
            contentTypePrompt = 'Bir sunum içeriği';
            break;
        }

        // Profesyonel OpenAI prompt'u
        const prompt = `
Sen profesyonel bir eğitim tasarımcısısın. Aşağıdaki bilgilere göre kapsamlı bir SCORM eğitim içeriği oluştur:

**EĞİTİM BİLGİLERİ:**
- Başlık: ${data.title}
- Açıklama: ${data.description || 'Detaylı eğitim içeriği'}
- Zorluk Seviyesi: ${difficulty}
- İçerik Türü: ${contentTypePrompt}
- Hedef Kitle: ${data.targetAudience || 'Genel kitle'}
- Min Puan: ${data.minScore || 0}
- Max Puan: ${data.maxScore || 100}
- Geçme Puanı: ${data.passingScore || 70}
- Süre Limiti: ${data.timeLimit ? data.timeLimit + ' dakika' : 'Sınırsız'}

**ÖĞRENME HEDEFLERİ:**
${learningObjectives}

**İSTENEN İÇERİK:**
${data.prompt}

**QUIZ GEREKSİNİMLERİ:**
${data.includeQuiz ? `
- ${data.numberOfQuestions} adet çoktan seçmeli soru oluştur
- Her soru için 4 seçenek (A, B, C, D)
- Doğru cevapları belirt
- Sorular ${data.title} konusu ile ilgili olmalı
- Zorluk seviyesi: ${difficulty}
` : 'Quiz gerekmiyor'}

**ÇIKTI FORMATI:**
HTML formatında, şu bölümleri içeren profesyonel eğitim içeriği:
1. Giriş ve öğrenme hedefleri
2. Ana konular ve detaylı açıklamalar
3. Pratik örnekler ve uygulamalar
4. ${data.includeQuiz ? 'Quiz soruları ve cevapları' : 'Özet ve değerlendirme'}

İçerik ${difficulty} seviyesinde, ${data.targetAudience || 'genel kitle'} için uygun olmalı.
`;

        // OpenAI API'ye istek gönder
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "Sen bir SCORM içeriği oluşturma uzmanısın. Verilen talimatlara göre HTML formatında eğitimsel içerik üreteceksin." },
            { role: "user", content: prompt }
          ],
          model: "gpt-3.5-turbo",
          max_tokens: 2000,
          temperature: 0.7,
        });

        content = completion.choices[0].message.content || generateProfessionalContent(data);
      } catch (openaiError) {
        console.error("OpenAI API hatası:", openaiError);
        // OpenAI hatası durumunda profesyonel içerik kullan
        content = generateProfessionalContent(data);
      }
    } else {
      // API anahtarı yoksa profesyonel içerik kullan
      content = generateProfessionalContent(data);
    }
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("API hatası:", error);
    
    // Hata türüne göre uygun yanıt döndür
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Geçersiz JSON formatı." },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
} 