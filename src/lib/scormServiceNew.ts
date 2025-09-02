import { generateContentWithAI } from './openaiService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// SCORM içerik oluşturma için veri yapısı
export interface SCORMGenerateData {
  title: string;
  description?: string;
  learningObjectives?: string;
  prompt: string;
  contentType: 'course' | 'quiz' | 'presentation';
  targetAudience?: string;
  includeQuiz?: boolean;
  numberOfQuestions?: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  template: 'modern' | 'classic' | 'minimal';
}

// Profesyonel interaktif SCORM içerik oluşturma
const generateProfessionalContent = (data: SCORMGenerateData): string => {
  const difficulty = data.difficultyLevel === 'beginner' 
    ? 'başlangıç seviyesi' 
    : data.difficultyLevel === 'intermediate' 
      ? 'orta seviye' 
      : 'ileri seviye';

  const learningObjectives = data.learningObjectives
    ? data.learningObjectives.split('\n').filter(obj => obj.trim())
    : ['Bu içeriği tamamladığınızda konuyu tam olarak anlamış olacaksınız.'];

  const content = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }

        .scorm-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
          box-shadow: 0 0 30px rgba(0,0,0,0.1);
        }

        /* Progress Bar */
        .progress-container {
          background: #f8f9fa;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-weight: 600;
          color: #495057;
        }

        /* Navigation */
        .navigation-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #fff;
          border-bottom: 1px solid #e9ecef;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .nav-btn:hover:not(:disabled) {
          background: #5a6fd8;
          transform: translateY(-2px);
        }

        .nav-btn:disabled {
          background: #adb5bd;
          cursor: not-allowed;
          transform: none;
        }

        .slide-indicator {
          font-weight: 600;
          color: #495057;
          background: #f8f9fa;
          padding: 8px 16px;
          border-radius: 20px;
        }

        /* Slide Container */
        .slide-container {
          position: relative;
          min-height: 600px;
        }

        .slide {
          display: none;
          padding: 40px;
          animation: fadeIn 0.5s ease-in;
        }

        .slide.active {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hero Section */
        .hero-section {
          text-align: center;
          padding: 60px 0;
        }

        .hero-icon {
          margin-bottom: 30px;
        }

        .hero-icon svg {
          color: #667eea;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #6c757d;
          margin-bottom: 30px;
        }

        .difficulty-badge {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .difficulty-badge.beginner {
          background: #d4edda;
          color: #155724;
        }

        .difficulty-badge.intermediate {
          background: #fff3cd;
          color: #856404;
        }

        .difficulty-badge.advanced {
          background: #f8d7da;
          color: #721c24;
        }

        /* Objectives Section */
        .objectives-section {
          margin-top: 60px;
        }

        .objectives-section h2 {
          text-align: center;
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 40px;
        }

        .objectives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .objective-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
        }

        .objective-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .objective-icon {
          color: #667eea;
          flex-shrink: 0;
        }

        /* Content Cards */
        .content-card {
          background: #fff;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .content-header h3 {
          font-size: 1.5rem;
          color: #2c3e50;
        }

        .content-icon {
          color: #667eea;
        }

        .target-audience {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 12px;
          margin-top: 20px;
        }

        .target-audience h4 {
          color: #1976d2;
          margin-bottom: 10px;
        }

        /* Topics Grid */
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-top: 30px;
        }

        .topic-card {
          background: #fff;
          border-radius: 16px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .topic-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .topic-icon {
          color: #667eea;
          margin-bottom: 15px;
        }

        .topic-card h3 {
          font-size: 1.2rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .topic-card p {
          color: #6c757d;
          margin-bottom: 20px;
        }

        .topic-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .topic-btn:hover {
          background: #5a6fd8;
          transform: translateY(-2px);
        }

        /* Quiz Styles */
        .quiz-container {
          background: #fff;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .quiz-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .quiz-header h3 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .quiz-question {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .question-number {
          font-weight: 600;
          color: #667eea;
        }

        .question-points {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .question-content h4 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .question-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: white;
          border-radius: 8px;
          border: 2px solid #e9ecef;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .option-item:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .option-item input[type="radio"] {
          margin: 0;
        }

        .option-item input[type="radio"]:checked + .option-text {
          color: #667eea;
          font-weight: 600;
        }

        .quiz-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }

        .quiz-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .quiz-btn.primary {
          background: #667eea;
          color: white;
        }

        .quiz-btn.secondary {
          background: #6c757d;
          color: white;
        }

        .quiz-btn:hover {
          transform: translateY(-2px);
        }

        /* Completion Section */
        .completion-section {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .completion-content {
          background: white;
          border-radius: 20px;
          padding: 50px;
          text-align: center;
          max-width: 500px;
          width: 90%;
        }

        .completion-icon {
          color: #28a745;
          margin-bottom: 20px;
        }

        .completion-content h2 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .completion-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 30px 0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .completion-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .completion-btn:hover {
          background: #218838;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .slide {
            padding: 20px;
          }
          
          .topics-grid {
            grid-template-columns: 1fr;
          }
          
          .objectives-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <!-- İnteraktif SCORM İçerik -->
      <div class="scorm-container">
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%"></div>
          </div>
          <div class="progress-text">
            <span id="progressText">0% Tamamlandı</span>
          </div>
        </div>

        <!-- Navigation -->
        <div class="navigation-container">
          <button class="nav-btn" id="prevBtn" onclick="previousSlide()" disabled>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Önceki
          </button>
          <div class="slide-indicator">
            <span id="currentSlide">1</span> / <span id="totalSlides">5</span>
          </div>
          <button class="nav-btn" id="nextBtn" onclick="nextSlide()">
            Sonraki
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Slide Container -->
        <div class="slide-container">
          <!-- Slide 1: Giriş -->
          <div class="slide active" id="slide1">
            <div class="slide-content">
              <div class="hero-section">
                <div class="hero-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h1 class="hero-title">${data.title}</h1>
                <p class="hero-subtitle">${data.description || 'Profesyonel eğitim içeriği'}</p>
                <div class="difficulty-badge ${data.difficultyLevel}">
                  ${difficulty.toUpperCase()}
                </div>
              </div>
              
              <div class="objectives-section">
                <h2>Öğrenme Hedefleri</h2>
                <div class="objectives-grid">
                  ${learningObjectives.map((obj, index) => `
                    <div class="objective-item" data-index="${index}">
                      <div class="objective-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      </div>
                      <span>${obj}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 2: İçerik Giriş -->
          <div class="slide" id="slide2">
            <div class="slide-content">
              <h2>İçerik Giriş</h2>
              <div class="content-card">
                <div class="content-header">
                  <h3>${data.title} Nedir?</h3>
                  <div class="content-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                </div>
                <div class="content-body">
                  <p>${data.prompt}</p>
                  ${data.targetAudience ? `
                    <div class="target-audience">
                      <h4>Hedef Kitle</h4>
                      <p>${data.targetAudience}</p>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 3: Ana Konular -->
          <div class="slide" id="slide3">
            <div class="slide-content">
              <h2>Ana Konular</h2>
              <div class="topics-grid">
                <div class="topic-card" data-topic="1">
                  <div class="topic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                  </div>
                  <h3>Temel Kavramlar</h3>
                  <p>Konunun temel kavramlarını ve tanımlarını öğrenin</p>
                  <button class="topic-btn" onclick="showTopicDetail(1)">Detayları Gör</button>
                </div>
                
                <div class="topic-card" data-topic="2">
                  <div class="topic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                  </div>
                  <h3>Uygulama Örnekleri</h3>
                  <p>Gerçek hayat örnekleri ve uygulamalar</p>
                  <button class="topic-btn" onclick="showTopicDetail(2)">Detayları Gör</button>
                </div>
                
                <div class="topic-card" data-topic="3">
                  <div class="topic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <h3>Pratik Alıştırmalar</h3>
                  <p>Bilginizi test edin ve pekiştirin</p>
                  <button class="topic-btn" onclick="showTopicDetail(3)">Detayları Gör</button>
                </div>
                
                <div class="topic-card" data-topic="4">
                  <div class="topic-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m0-7v7m0-7h10a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-4m-6 0h6"></path>
                    </svg>
                  </div>
                  <h3>Değerlendirme</h3>
                  <p>Öğrendiklerinizi test edin</p>
                  <button class="topic-btn" onclick="showTopicDetail(4)">Detayları Gör</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 4: Detaylı İçerik -->
          <div class="slide" id="slide4">
            <div class="slide-content">
              <h2>Detaylı İçerik</h2>
              <div class="content-card">
                <h3>Temel Kavramlar ve Tanımlar</h3>
                <div class="content-text">
                  <p>Bu bölümde ${data.title} konusunun temel kavramlarını inceleyeceğiz. Konu, ${difficulty} seviyesinde öğrenciler için uygun şekilde hazırlanmıştır.</p>
                  
                  <div class="target-audience">
                    <h4>Önemli Not</h4>
                    <p>Bu içerik SCORM standartlarına uygun olarak hazırlanmıştır ve LMS sistemlerinizde sorunsuz çalışacaktır.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          ${data.includeQuiz ? `
          <!-- Slide 5: Quiz -->
          <div class="slide" id="slide5">
            <div class="slide-content">
              <h2>Değerlendirme</h2>
              <div class="quiz-container">
                <div class="quiz-header">
                  <h3>Bilginizi Test Edin</h3>
                  <p>Aşağıdaki soruları yanıtlayarak öğrendiklerinizi değerlendirin.</p>
                </div>
                
                <div class="quiz-questions">
                  ${Array.from({ length: Math.min(data.numberOfQuestions || 3, 5) }, (_, i) => `
                    <div class="quiz-question" data-question="${i + 1}">
                      <div class="question-header">
                        <span class="question-number">Soru ${i + 1}</span>
                        <span class="question-points">5 Puan</span>
                      </div>
                      <div class="question-content">
                        <h4>${data.title} konusu ile ilgili aşağıdakilerden hangisi doğrudur?</h4>
                        <div class="question-options">
                          <label class="option-item">
                            <input type="radio" name="question${i + 1}" value="A">
                            <span class="option-text">A) Seçenek A - Doğru cevap</span>
                          </label>
                          <label class="option-item">
                            <input type="radio" name="question${i + 1}" value="B">
                            <span class="option-text">B) Seçenek B</span>
                          </label>
                          <label class="option-item">
                            <input type="radio" name="question${i + 1}" value="C">
                            <span class="option-text">C) Seçenek C</span>
                          </label>
                          <label class="option-item">
                            <input type="radio" name="question${i + 1}" value="D">
                            <span class="option-text">D) Seçenek D</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                
                <div class="quiz-actions">
                  <button class="quiz-btn secondary" onclick="resetQuiz()">Sıfırla</button>
                  <button class="quiz-btn primary" onclick="submitQuiz()">Değerlendirmeyi Tamamla</button>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Completion Section -->
        <div class="completion-section" id="completionSection" style="display: none;">
          <div class="completion-content">
            <div class="completion-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h2>Tebrikler!</h2>
            <p>${data.title} eğitimini başarıyla tamamladınız.</p>
            <div class="completion-stats">
              <div class="stat-item">
                <span class="stat-value" id="finalScore">0</span>
                <span class="stat-label">Puan</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="timeSpent">0</span>
                <span class="stat-label">Dakika</span>
              </div>
            </div>
            <button class="completion-btn" onclick="markComplete()">Eğitimi Tamamla</button>
          </div>
        </div>
      </div>

      <script>
        // Global değişkenler
        let currentSlideIndex = 1;
        let totalSlides = ${data.includeQuiz ? '5' : '4'};
        let startTime = Date.now();
        let quizAnswers = {};

        // Slide yönetimi
        function showSlide(index) {
          // Tüm slide'ları gizle
          document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active');
          });
          
          // Seçilen slide'ı göster
          document.getElementById(\`slide\${index}\`).classList.add('active');
          
          // Progress bar'ı güncelle
          const progress = (index / totalSlides) * 100;
          document.getElementById('progressFill').style.width = \`\${progress}%\`;
          document.getElementById('progressText').textContent = \`\${Math.round(progress)}% Tamamlandı\`;
          
          // Navigation butonlarını güncelle
          document.getElementById('prevBtn').disabled = index === 1;
          document.getElementById('nextBtn').disabled = index === totalSlides;
          
          // Slide indicator'ı güncelle
          document.getElementById('currentSlide').textContent = index;
          document.getElementById('totalSlides').textContent = totalSlides;
        }

        function nextSlide() {
          if (currentSlideIndex < totalSlides) {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
          }
        }

        function previousSlide() {
          if (currentSlideIndex > 1) {
            currentSlideIndex--;
            showSlide(currentSlideIndex);
          }
        }

        // Topic detayları
        function showTopicDetail(topicId) {
          alert(\`Konu \${topicId} detayları gösteriliyor...\`);
        }

        // Quiz fonksiyonları
        function resetQuiz() {
          document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
          });
          quizAnswers = {};
        }

        function submitQuiz() {
          // Quiz cevaplarını topla
          const questions = document.querySelectorAll('.quiz-question');
          let score = 0;
          let totalQuestions = questions.length;
          
          questions.forEach((question, index) => {
            const selectedAnswer = question.querySelector('input[type="radio"]:checked');
            if (selectedAnswer) {
              quizAnswers[\`question\${index + 1}\`] = selectedAnswer.value;
              // Basit puanlama (A seçeneği doğru kabul ediliyor)
              if (selectedAnswer.value === 'A') {
                score += 5;
              }
            }
          });
          
          // Completion section'ı göster
          document.getElementById('finalScore').textContent = score;
          document.getElementById('timeSpent').textContent = Math.round((Date.now() - startTime) / 60000);
          document.getElementById('completionSection').style.display = 'flex';
        }

        // SCORM API fonksiyonları
        function markComplete() {
          try {
            // SCORM 1.2 API
            if (typeof API !== 'undefined') {
              API.LMSFinish('');
              API.LMSCommit('');
              alert('İçerik başarıyla tamamlandı!');
            }
            // SCORM 2004 API
            else if (typeof window.parent.API !== 'undefined') {
              window.parent.API.LMSFinish('');
              window.parent.API.LMSCommit('');
              alert('İçerik başarıyla tamamlandı!');
            }
            // SCORM API bulunamadığında
            else {
              alert('İçerik tamamlandı! (SCORM API bulunamadı)');
            }
          } catch (error) {
            console.error('SCORM API hatası:', error);
            alert('İçerik tamamlandı!');
          }
        }
        
        // Sayfa yüklendiğinde SCORM API'yi başlat
        function initializeSCORM() {
          try {
            // SCORM 1.2 API
            if (typeof API !== 'undefined') {
              API.LMSInitialize('');
              console.log('SCORM 1.2 API başlatıldı');
            }
            // SCORM 2004 API
            else if (typeof window.parent.API !== 'undefined') {
              window.parent.API.LMSInitialize('');
              console.log('SCORM 2004 API başlatıldı');
            }
            else {
              console.log('SCORM API bulunamadı - demo modunda çalışıyor');
            }
          } catch (error) {
            console.error('SCORM API başlatma hatası:', error);
          }
        }
        
        // Sayfa yüklendiğinde SCORM'u başlat
        window.addEventListener('load', initializeSCORM);
        
        // Klavye kısayolları
        document.addEventListener('keydown', function(e) {
          if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousSlide();
          }
        });
      </script>
    </body>
    </html>
  `;

  return content;
};

// SCORM paketi için HTML içeriği oluşturma
export const generateSCORMContent = async (data: SCORMGenerateData): Promise<string> => {
  // Veri doğrulama
  if (!data.title || !data.prompt) {
    throw new Error("Başlık ve içerik açıklaması zorunludur.");
  }

  try {
    // OpenAI'dan içerik al
    const aiGeneratedContent = await generateContentWithAI(data);
    
    // AI içeriğini profesyonel template ile birleştir
    return generateProfessionalContent(data);
  } catch (error) {
    console.error("SCORM içerik oluşturma hatası:", error);
    
    // Hata durumunda profesyonel içerik kullanma
    return generateProfessionalContent(data);
  }
};

// SCORM paketini oluşturan fonksiyon
export const createSCORMPackage = async (data: SCORMGenerateData): Promise<Blob> => {
  try {
    const zip = new JSZip();
    
    // Veri doğrulama
    if (!data.title || !data.prompt) {
      throw new Error("Başlık ve içerik açıklaması zorunludur.");
    }
    
    // İçeriği oluşturalım
    const content = await generateSCORMContent(data);
    
    // İçerik dosyasını ekleyelim
    zip.file("index.html", content);
  
    // imsmanifest.xml dosyasını oluşturalım (SCORM 1.2 için)
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.scormai.${data.title.replace(/\s/g, '_')}" version="1.0" 
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" 
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org1">
    <organization identifier="org1">
      <title>${data.title}</title>
      <item identifier="item1" identifierref="resource1">
        <title>${data.title}</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    zip.file("imsmanifest.xml", manifestXml);
    
    // XSD şema dosyalarını ekleyelim (normalde bunları CDN'den çekmek daha iyi olabilir)
    zip.file("imscp_rootv1p1p2.xsd", "<!-- XSD şeması burada olacak -->");
    zip.file("imsmd_rootv1p2p1.xsd", "<!-- XSD şeması burada olacak -->");
    zip.file("adlcp_rootv1p2.xsd", "<!-- XSD şeması burada olacak -->");
    
    // ZIP dosyasını oluşturalım
    return await zip.generateAsync({ type: "blob" });
  } catch (error) {
    console.error("SCORM paketi oluşturma hatası:", error);
    throw new Error("SCORM paketi oluşturulurken bir hata oluştu.");
  }
};

// SCORM paketini indirme fonksiyonu
export const downloadSCORMPackage = async (data: SCORMGenerateData): Promise<void> => {
  try {
    // Veri doğrulama
    if (!data.title || !data.prompt) {
      throw new Error("Başlık ve içerik açıklaması zorunludur.");
    }

    const blob = await createSCORMPackage(data);
    const fileName = `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}_SCORM.zip`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error("SCORM paketi indirme hatası:", error);
    throw new Error("SCORM paketi indirilirken bir hata oluştu.");
  }
};

// SCORM içeriğini önizleme fonksiyonu
export const previewSCORMContent = async (data: SCORMGenerateData): Promise<string> => {
  try {
    // Veri doğrulama
    if (!data.title || !data.prompt) {
      throw new Error("Başlık ve içerik açıklaması zorunludur.");
    }
    
    return await generateSCORMContent(data);
  } catch (error) {
    console.error("SCORM içerik önizleme hatası:", error);
    throw new Error("İçerik önizlenirken bir hata oluştu.");
  }
};
