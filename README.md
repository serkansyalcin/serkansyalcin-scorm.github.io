# SCORM AI - Yapay Zeka Destekli SCORM İçerik Üretme Aracı

Bu proje, yapay zeka teknolojisi kullanarak SCORM uyumlu eğitim içerikleri oluşturmanızı sağlayan modern bir web uygulamasıdır.

## 🚀 Özellikler

- **Yapay Zeka ile İçerik Üretimi**: OpenAI GPT teknolojisi ile otomatik içerik oluşturma
- **SCORM Uyumluluğu**: SCORM 1.2 ve 2004 standartlarına uyumlu paketler
- **Çoklu Şablon Desteği**: Modern, klasik ve minimal tasarım şablonları
- **Quiz Entegrasyonu**: Otomatik quiz soruları oluşturma
- **SCORM Cloud Entegrasyonu**: Doğrudan buluta yükleme ve paylaşma
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Dashboard**: İçerik yönetimi ve analitik

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **AI**: OpenAI GPT-3.5/4
- **SCORM**: SCORM 1.2/2004 desteği
- **Cloud**: SCORM Cloud API entegrasyonu

## 📋 Gereksinimler

- Node.js 18+ 
- npm/yarn/pnpm
- OpenAI API anahtarı
- SCORM Cloud hesabı (opsiyonel)

## 🚀 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd scorm
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
# veya
pnpm install
```

3. **Çevre değişkenlerini ayarlayın:**
`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# OpenAI API Anahtarı
OPENAI_API_KEY=your_openai_api_key_here

# SCORM Cloud API Ayarları (opsiyonel)
SCORM_CLOUD_APP_ID=your_scorm_cloud_app_id_here
SCORM_CLOUD_SECRET_KEY=your_scorm_cloud_secret_key_here

# Next.js Ayarları
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

5. **Tarayıcınızda açın:**
[http://localhost:3000](http://localhost:3000)

## 🔧 API Anahtarları

### OpenAI API Anahtarı
1. [OpenAI Platform](https://platform.openai.com/api-keys) adresine gidin
2. Hesabınızı oluşturun veya giriş yapın
3. API anahtarı oluşturun
4. `.env.local` dosyasına `OPENAI_API_KEY` olarak ekleyin

### SCORM Cloud API (Opsiyonel)
1. [SCORM Cloud](https://cloud.scorm.com/) hesabı oluşturun
2. API bilgilerinizi alın
3. `.env.local` dosyasına `SCORM_CLOUD_APP_ID` ve `SCORM_CLOUD_SECRET_KEY` olarak ekleyin

## 📖 Kullanım

### İçerik Oluşturma
1. Ana sayfadan "İçerik Oluştur" butonuna tıklayın
2. İçerik bilgilerini doldurun (başlık, açıklama, öğrenme hedefleri)
3. İçerik türü, zorluk seviyesi ve şablon seçin
4. Quiz eklemek istiyorsanız "Quiz ekle" seçeneğini işaretleyin
5. "İçerik Oluştur" butonuna tıklayın
6. Önizlemeyi kontrol edin ve SCORM paketini indirin

### Dashboard
- Oluşturduğunuz tüm içerikleri görüntüleyin
- İstatistikleri takip edin
- İçerikleri yönetin ve düzenleyin
- SCORM Cloud entegrasyonunu kontrol edin

## 🎨 Şablonlar

- **Modern**: Gradient renkler ve modern tasarım
- **Klasik**: Geleneksel eğitim materyali görünümü
- **Minimal**: Sade ve temiz tasarım

## 📦 SCORM Paketleri

Oluşturulan içerikler şu özelliklere sahiptir:
- SCORM 1.2 ve 2004 uyumluluğu
- İlerleme takibi
- Tamamlanma durumu bildirimi
- LMS entegrasyonu

## 🚀 Deployment

### Vercel (Önerilen)
```bash
npm run build
vercel --prod
```

### Diğer Platformlar
```bash
npm run build
npm start
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Sorunlarınız için GitHub Issues kullanın veya iletişime geçin.

## 🔄 Güncellemeler

- v1.0.0: İlk sürüm
- OpenAI entegrasyonu
- SCORM Cloud entegrasyonu
- Dashboard ve analitik
