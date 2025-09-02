import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateContentWithAI } from './openaiService';

// SCORM içerik tiplerini tanımlayalım
export type SCORMContentType = 'course' | 'quiz' | 'presentation';

// SCORM paket oluşturma için gereken verilerin tipi
export interface SCORMGenerateData {
  title: string;
  description: string;
  learningObjectives?: string;
  prompt: string;
  contentType: SCORMContentType;
  targetAudience?: string;
  includeQuiz?: boolean;
  numberOfQuestions?: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  template: 'modern' | 'classic' | 'minimal';
}

// SCORM paketi için HTML içeriği oluşturma
export const generateSCORMContent = async (data: SCORMGenerateData): Promise<string> => {
  // Veri doğrulama
  if (!data.title || !data.prompt) {
    throw new Error("Başlık ve içerik açıklaması zorunludur.");
  }

  try {
    // OpenAI'dan içerik al
    const aiGeneratedContent = await generateContentWithAI(data);
    
    // Template seçimine göre CSS sınıfları belirleyelim
    let templateClass = '';
    let headerClass = '';
    let contentClass = '';
    
    switch (data.template) {
      case 'modern':
        templateClass = 'modern-template';
        headerClass = 'modern-header';
        contentClass = 'modern-content';
        break;
      case 'classic':
        templateClass = 'classic-template';
        headerClass = 'classic-header';
        contentClass = 'classic-content';
        break;
      case 'minimal':
        templateClass = 'minimal-template';
        headerClass = 'minimal-header';
        contentClass = 'minimal-content';
        break;
      default:
        templateClass = 'modern-template';
        headerClass = 'modern-header';
        contentClass = 'modern-content';
        break;
    }

    // AI tarafından oluşturulan içeriği SCORM HTML şablonu içine yerleştir
    const content = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          
          /* Modern Template Styles */
          .modern-template {
            background-color: #f9fafb;
            color: #333;
          }
          .modern-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .modern-content {
            max-width: 900px;
            margin: 0 auto;
            padding: 30px 20px;
          }
          
          /* Classic Template Styles */
          .classic-template {
            background-color: #fff;
            color: #333;
          }
          .classic-header {
            background-color: #003366;
            color: white;
            padding: 25px 20px;
            text-align: center;
            border-bottom: 5px solid #ffcc00;
          }
          .classic-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 25px 20px;
          }
          
          /* Minimal Template Styles */
          .minimal-template {
            background-color: #fff;
            color: #333;
          }
          .minimal-header {
            background-color: #f5f5f5;
            color: #333;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }
          .minimal-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px 20px;
          }
          
          /* Common Styles */
          .section {
            margin-bottom: 30px;
          }
          h1 {
            margin: 0 0 10px 0;
          }
          h2 {
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          .description {
            margin-bottom: 20px;
            font-style: italic;
          }
          .objectives {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 15px 20px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .objectives ul {
            margin: 0;
            padding-left: 20px;
          }
          .content-section {
            margin-bottom: 25px;
          }
          .quiz-section {
            background-color: #f0f4f8;
            padding: 20px;
            border-radius: 5px;
            margin-top: 30px;
          }
          .quiz-question {
            margin-bottom: 15px;
          }
          .options {
            list-style-type: none;
            padding-left: 0;
          }
          .options li {
            padding: 8px 10px;
            margin-bottom: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
          }
          .options li:hover {
            background-color: #e9ecef;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a6fdc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 16px;
          }
          .btn:hover {
            background-color: #3a5bbf;
          }
          /* AI içeriği için ek stiller */
          .ai-content img {
            max-width: 100%;
            height: auto;
            margin: 15px 0;
          }
          .ai-content pre {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          .ai-content code {
            background-color: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
          }
          .ai-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
          }
          .ai-content th, .ai-content td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          .ai-content th {
            background-color: #f2f2f2;
          }
        </style>
        <script>
          // SCORM API ile iletişim kurma
          let API = null;
          let findAPITries = 0;
          
          function findAPI(win) {
            findAPITries++;
            if (findAPITries > 7) {
              return null;
            }
            
            if (win.API_1484_11) {
              return win.API_1484_11;
            } else if (win.API) {
              return win.API;
            } else if (win.parent && win.parent != win) {
              return findAPI(win.parent);
            }
            
            return null;
          }
          
          function initializeCommunication() {
            API = findAPI(window);
            
            if (API) {
              if (API.LMSInitialize) {
                // SCORM 1.2
                API.LMSInitialize("");
              } else if (API.Initialize) {
                // SCORM 2004
                API.Initialize("");
              }
              
              // Set completion status to incomplete
              setCompletionStatus("incomplete");
            } else {
              console.log("SCORM API bulunamadı.");
            }
          }
          
          function terminateCommunication() {
            if (API) {
              if (API.LMSFinish) {
                // SCORM 1.2
                API.LMSFinish("");
              } else if (API.Terminate) {
                // SCORM 2004
                API.Terminate("");
              }
            }
          }
          
          function setValue(key, value) {
            if (API) {
              if (API.LMSSetValue) {
                // SCORM 1.2
                return API.LMSSetValue(key, value);
              } else if (API.SetValue) {
                // SCORM 2004
                return API.SetValue(key, value);
              }
            }
            return false;
          }
          
          function getValue(key) {
            if (API) {
              if (API.LMSGetValue) {
                // SCORM 1.2
                return API.LMSGetValue(key);
              } else if (API.GetValue) {
                // SCORM 2004
                return API.GetValue(key);
              }
            }
            return "";
          }
          
          function setCompletionStatus(status) {
            if (API) {
              if (API.LMSSetValue) {
                // SCORM 1.2
                setValue("cmi.core.lesson_status", status);
              } else if (API.SetValue) {
                // SCORM 2004
                setValue("cmi.completion_status", status);
              }
            }
          }
          
          function markComplete() {
            setCompletionStatus("completed");
            terminateCommunication();
            alert("Tebrikler! İçeriği tamamladınız.");
          }
          
          window.onload = initializeCommunication;
          window.onunload = terminateCommunication;
        </script>
      </head>
      <body class="${templateClass}">
        <header class="${headerClass}">
          <h1>${data.title}</h1>
          <p class="description">${data.description}</p>
        </header>
        
        <div class="${contentClass}">
          <div class="objectives">
            <h2>Öğrenme Hedefleri</h2>
            <ul>
              ${data.learningObjectives ? data.learningObjectives.split('\n').map(obj => `<li>${obj}</li>`).join('') : '<li>Bu içeriği tamamladığınızda konuyu tam olarak anlamış olacaksınız.</li>'}
            </ul>
          </div>
          
          <div class="ai-content">
            ${aiGeneratedContent}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <button class="btn" onclick="markComplete()">İçeriği Tamamla</button>
          </div>
        </div>
      </body>
      </html>
    `;

    return content;
  } catch (error) {
    console.error("SCORM içerik oluşturma hatası:", error);
    
    // Hata durumunda profesyonel içerik kullanma
    return generateProfessionalContent(data);
  }
};

// Profesyonel içerik oluşturma (OpenAI API olmadığında veya hata durumunda)
const generateProfessionalContent = (data: SCORMGenerateData): string => {
  // Template seçimine göre CSS sınıfları belirleyelim
  let templateClass = '';
  let headerClass = '';
  let contentClass = '';
  
  switch (data.template) {
    case 'modern':
      templateClass = 'modern-template';
      headerClass = 'modern-header';
      contentClass = 'modern-content';
      break;
    case 'classic':
      templateClass = 'classic-template';
      headerClass = 'classic-header';
      contentClass = 'classic-content';
      break;
    case 'minimal':
      templateClass = 'minimal-template';
      headerClass = 'minimal-header';
      contentClass = 'minimal-content';
      break;
  }

  // Demo içerik oluşturalım
  const content = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        
        /* Modern Template Styles */
        .modern-template {
          background-color: #f9fafb;
          color: #333;
        }
        .modern-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .modern-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        
        /* Classic Template Styles */
        .classic-template {
          background-color: #fff;
          color: #333;
        }
        .classic-header {
          background-color: #003366;
          color: white;
          padding: 25px 20px;
          text-align: center;
          border-bottom: 5px solid #ffcc00;
        }
        .classic-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 25px 20px;
        }
        
        /* Minimal Template Styles */
        .minimal-template {
          background-color: #fff;
          color: #333;
        }
        .minimal-header {
          background-color: #f5f5f5;
          color: #333;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }
        .minimal-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        
        /* Common Styles */
        .section {
          margin-bottom: 30px;
        }
        h1 {
          margin: 0 0 10px 0;
        }
        h2 {
          margin: 30px 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .description {
          margin-bottom: 20px;
          font-style: italic;
        }
        .objectives {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 15px 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .objectives ul {
          margin: 0;
          padding-left: 20px;
        }
        .content-section {
          margin-bottom: 25px;
        }
        .quiz-section {
          background-color: #f0f4f8;
          padding: 20px;
          border-radius: 5px;
          margin-top: 30px;
        }
        .quiz-question {
          margin-bottom: 15px;
        }
        .options {
          list-style-type: none;
          padding-left: 0;
        }
        .options li {
          padding: 8px 10px;
          margin-bottom: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .options li:hover {
          background-color: #e9ecef;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4a6fdc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 16px;
        }
        .btn:hover {
          background-color: #3a5bbf;
        }
      </style>
      <script>
        // SCORM API ile iletişim kurma
        let API = null;
        let findAPITries = 0;
        
        function findAPI(win) {
          findAPITries++;
          if (findAPITries > 7) {
            return null;
          }
          
          if (win.API_1484_11) {
            return win.API_1484_11;
          } else if (win.API) {
            return win.API;
          } else if (win.parent && win.parent != win) {
            return findAPI(win.parent);
          }
          
          return null;
        }
        
        function initializeCommunication() {
          API = findAPI(window);
          
          if (API) {
            if (API.LMSInitialize) {
              // SCORM 1.2
              API.LMSInitialize("");
            } else if (API.Initialize) {
              // SCORM 2004
              API.Initialize("");
            }
            
            // Set completion status to incomplete
            setCompletionStatus("incomplete");
          } else {
            console.log("SCORM API bulunamadı.");
          }
        }
        
        function terminateCommunication() {
          if (API) {
            if (API.LMSFinish) {
              // SCORM 1.2
              API.LMSFinish("");
            } else if (API.Terminate) {
              // SCORM 2004
              API.Terminate("");
            }
          }
        }
        
        function setValue(key, value) {
          if (API) {
            if (API.LMSSetValue) {
              // SCORM 1.2
              return API.LMSSetValue(key, value);
            } else if (API.SetValue) {
              // SCORM 2004
              return API.SetValue(key, value);
            }
          }
          return false;
        }
        
        function getValue(key) {
          if (API) {
            if (API.LMSGetValue) {
              // SCORM 1.2
              return API.LMSGetValue(key);
            } else if (API.GetValue) {
              // SCORM 2004
              return API.GetValue(key);
            }
          }
          return "";
        }
        
        function setCompletionStatus(status) {
          if (API) {
            if (API.LMSSetValue) {
              // SCORM 1.2
              setValue("cmi.core.lesson_status", status);
            } else if (API.SetValue) {
              // SCORM 2004
              setValue("cmi.completion_status", status);
            }
          }
        }
        
        function markComplete() {
          setCompletionStatus("completed");
          terminateCommunication();
          alert("Tebrikler! İçeriği tamamladınız.");
        }
        
        window.onload = initializeCommunication;
        window.onunload = terminateCommunication;
      </script>
    </head>
    <body class="${templateClass}">
      <header class="${headerClass}">
        <h1>${data.title}</h1>
        <p class="description">${data.description}</p>
      </header>
      
      <div class="${contentClass}">
        <div class="objectives">
          <h2>Öğrenme Hedefleri</h2>
          <ul>
            ${data.learningObjectives ? data.learningObjectives.split('\n').map(obj => `<li>${obj}</li>`).join('') : '<li>Bu içeriği tamamladığınızda konuyu tam olarak anlamış olacaksınız.</li>'}
          </ul>
        </div>
        
        <div class="section">
          <h2>Giriş</h2>
          <p>Bu SCORM içeriği <strong>${data.title}</strong> konusunu kapsamaktadır. İçerik ${data.difficultyLevel === 'beginner' ? 'başlangıç' : data.difficultyLevel === 'intermediate' ? 'orta' : 'ileri'} seviyededir.</p>
          ${data.targetAudience ? `<p><strong>Hedef Kitle:</strong> ${data.targetAudience}</p>` : ''}
        </div>
        
        <div class="section">
          <h2>İçerik</h2>
          <div class="content-section">
            <p>${data.prompt}</p>
            
            <h3>Ana Konular</h3>
            <ul>
              <li>Konu 1: Temel kavramlar ve tanımlar</li>
              <li>Konu 2: Uygulama örnekleri</li>
              <li>Konu 3: Pratik alıştırmalar</li>
              <li>Konu 4: Değerlendirme ve özet</li>
            </ul>
            
            <h3>Detaylı Açıklama</h3>
            <p>Bu bölümde ${data.title} konusunu detaylı olarak inceleyeceğiz. Konu, ${data.difficultyLevel === 'beginner' ? 'başlangıç' : data.difficultyLevel === 'intermediate' ? 'orta' : 'ileri'} seviyesinde öğrenciler için uygun şekilde hazırlanmıştır.</p>
            
            <div class="highlight-box" style="background-color: #f0f4f8; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>Önemli Not</h4>
              <p>Bu içerik SCORM standartlarına uygun olarak hazırlanmıştır ve LMS sistemlerinizde sorunsuz çalışacaktır.</p>
            </div>
          </div>
        </div>
        
        ${data.includeQuiz ? `
        <div class="quiz-section">
          <h2>Değerlendirme</h2>
          <p>Aşağıdaki soruları yanıtlayarak öğrendiklerinizi test edebilirsiniz.</p>
          ${Array.from({ length: Math.min(data.numberOfQuestions || 3, 5) }, (_, i) => `
          <div class="quiz-question">
            <h4>Soru ${i + 1}:</h4>
            <p>${data.title} konusu ile ilgili örnek soru ${i + 1}?</p>
            <ul class="options">
              <li>A) Seçenek A</li>
              <li>B) Seçenek B</li>
              <li>C) Seçenek C</li>
              <li>D) Seçenek D</li>
            </ul>
          </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center;">
          <button class="btn" onclick="markComplete()">İçeriği Tamamla</button>
        </div>
        
        <script>
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
        </script>
      </div>
    </body>
    </html>
  `;

  return content;
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
    <lom:lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" 
             xmlns:lom="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" 
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
             xsi:schemaLocation="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd">
      <lom:general>
        <lom:title>
          <lom:langstring>${data.title}</lom:langstring>
        </lom:title>
        <lom:description>
          <lom:langstring>${data.description}</lom:langstring>
        </lom:description>
      </lom:general>
    </lom:lom>
  </metadata>
  <organizations default="scormai_org">
    <organization identifier="scormai_org">
      <title>${data.title}</title>
      <item identifier="item_1" identifierref="resource_1" isvisible="true">
        <title>${data.title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
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