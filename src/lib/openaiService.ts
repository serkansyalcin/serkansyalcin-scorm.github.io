import { SCORMGenerateData } from './scormService';

// API anahtarını kontrol et - Bu fonksiyon artık her zaman true döndürür
// çünkü API çağrıları sunucu tarafında yapılacak
export const isOpenAIConfigured = (): boolean => {
  return true;
};

// İçerik oluşturma API'sini çağır
export const generateContentWithAI = async (data: SCORMGenerateData): Promise<string> => {
  try {
    // API rotasına istek gönder
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // Yanıtı kontrol et
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API isteği başarısız oldu");
    }
    
    // Yanıtı al
    const result = await response.json();
    return result.content;
  } catch (error) {
    console.error("OpenAI ile içerik oluşturma hatası:", error);
    
    // Hata durumunda demo içerik kullanılacağını belirt
    throw new Error("İçerik oluşturulurken bir hata oluştu. Demo içerik kullanılacak.");
  }
};

// Quiz soruları oluşturma
export const generateQuizQuestionsWithAI = async (
  subject: string, 
  numberOfQuestions: number, 
  difficulty: string
): Promise<string> => {
  try {
    // API rotasına istek gönder (Quiz için ayrı bir API rotası oluşturulabilir)
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${subject} Quiz`,
        description: `${subject} konusunda ${numberOfQuestions} adet ${difficulty} seviyesinde quiz soruları`,
        prompt: `${subject} konusunda ${numberOfQuestions} adet ${difficulty} seviyesinde çoktan seçmeli quiz soruları oluştur`,
        contentType: 'quiz',
        includeQuiz: true,
        numberOfQuestions,
        difficultyLevel: difficulty,
        template: 'modern',
      }),
    });
    
    // Yanıtı kontrol et
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API isteği başarısız oldu");
    }
    
    // Yanıtı al
    const result = await response.json();
    return result.content;
  } catch (error) {
    console.error("OpenAI ile quiz soruları oluşturma hatası:", error);
    throw new Error("Quiz soruları oluşturulurken bir hata oluştu.");
  }
}; 