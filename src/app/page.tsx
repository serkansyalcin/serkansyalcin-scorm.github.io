'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Cloud, 
  Download, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Brain,
  BookOpen,
  Users,
  Target,
  Rocket,
  FileText,
  Shield,
  Clock
} from 'lucide-react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-secondary-900">
                SCORM AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/create">
                <Button variant="outline" className="btn-outline">
                  İçerik Oluştur
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="btn-primary">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary-100 text-primary-700 border-primary-200">
              <Sparkles className="h-4 w-4 mr-2" />
              Yapay Zeka Destekli
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-secondary-900">
              SCORM İçerik
              <br />
              <span className="text-primary-600">Oluşturucu</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Yapay zeka teknolojisi ile profesyonel SCORM içerikleri oluşturun. 
              Sadece dakikalar içinde LMS sistemlerinize entegre edilebilir eğitim materyalleri hazırlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create">
                <Button size="lg" className="btn-primary text-lg px-8 py-4">
                  <Rocket className="h-5 w-5 mr-2" />
                  Hemen Başla
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-4">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Örnekleri Gör
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Neden SCORM AI?</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Eğitim içeriği oluşturma sürecinizi devrim niteliğinde değiştiren özellikler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-primary-600 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary-900">Yapay Zeka ile İçerik</CardTitle>
                <CardDescription className="text-secondary-600">
                  OpenAI GPT teknolojisi ile otomatik içerik oluşturma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  Konunuzu ve hedeflerinizi belirleyin, yapay zeka sizin için profesyonel eğitim içeriği oluştursun. 
                  Quiz, etkileşimli öğeler ve çoklu zorluk seviyeleri dahil.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-success-600 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary-900">SCORM Uyumlu</CardTitle>
                <CardDescription className="text-secondary-600">
                  SCORM 1.2 ve 2004 standartlarına tam uyumluluk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  Oluşturulan içerikler tüm LMS platformlarına (Moodle, Canvas, Blackboard, TalentLMS) 
                  sorunsuz entegre edilebilir. İlerleme takibi ve tamamlanma durumu dahil.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 bg-accent-600 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary-900">Cloud Entegrasyonu</CardTitle>
                <CardDescription className="text-secondary-600">
                  SCORM Cloud API ile doğrudan bulut entegrasyonu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 leading-relaxed">
                  İçeriklerinizi doğrudan SCORM Cloud'a yükleyin, paylaşın ve 
                  öğrenci ilerlemelerini gerçek zamanlı takip edin.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              4 basit adımda profesyonel SCORM içeriği oluşturun
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "İçerik Tanımla",
                description: "Başlık, açıklama, öğrenme hedefleri ve içerik talimatlarını girin.",
                icon: Target,
                color: "bg-primary-600"
              },
              {
                step: "02", 
                title: "Özelleştir",
                description: "Zorluk seviyesini, hedef kitleyi ve şablon tercihlerinizi belirleyin.",
                icon: Users,
                color: "bg-success-600"
              },
              {
                step: "03",
                title: "Oluştur", 
                description: "Yapay zeka belirlediğiniz kriterlere göre içeriği otomatik oluşturur.",
                icon: Zap,
                color: "bg-accent-600"
              },
              {
                step: "04",
                title: "İndir veya Paylaş",
                description: "İçeriği SCORM paketi olarak indirin veya doğrudan buluta yükleyin.",
                icon: Download,
                color: "bg-warning-600"
              }
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 relative">
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${item.color} rounded-xl w-fit group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-sm font-mono bg-secondary-100 text-secondary-700">
                      {item.step}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-secondary-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FileText, label: "İçerik Oluşturuldu", value: "10,000+" },
              { icon: Users, label: "Aktif Kullanıcı", value: "2,500+" },
              { icon: Clock, label: "Zaman Tasarrufu", value: "80%" },
              { icon: Shield, label: "Güvenilirlik", value: "99.9%" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto p-4 bg-primary-100 rounded-2xl w-fit mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-2">{stat.value}</div>
                <div className="text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            İlk SCORM içeriğinizi oluşturmak için sadece birkaç dakika yeterli
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-secondary-50 text-lg px-8 py-4">
              <Play className="h-5 w-5 mr-2" />
              Ücretsiz Dene
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">SCORM AI</h3>
          </div>
          <p className="text-secondary-400 mb-4">
            Yapay zeka destekli SCORM içerik oluşturma platformu
          </p>
          <p className="text-sm text-secondary-500">
            © 2024 SCORM AI. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
