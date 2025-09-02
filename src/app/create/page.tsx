'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SCORMGenerateData, createSCORMPackage, previewSCORMContent } from '@/lib/scormService';
import { createCourse, isScormCloudConfigured } from '@/lib/scormCloudService';
import { 
  Download, 
  Eye, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Settings,
  FileText,
  Sparkles,
  ArrowLeft,
  Zap,
  Target,
  Users,
  Palette
} from 'lucide-react';

export default function CreatePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<SCORMGenerateData>({
    title: '',
    description: '',
    learningObjectives: '',
    prompt: '',
    contentType: 'course',
    targetAudience: '',
    includeQuiz: false,
    numberOfQuestions: 5,
    difficultyLevel: 'beginner',
    template: 'modern',
    minScore: 0,
    maxScore: 100,
    passingScore: 70,
    timeLimit: 0,
    allowRetake: true,
    maxAttempts: 3,
    slideCount: 5,
    includeAnimations: true,
    includeAudio: false,
    includeVideo: false,
    includeInteractiveElements: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [isUploading, setIsUploading] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: keyof SCORMGenerateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.title || !formData.prompt) {
      setErrorMessage('Başlık ve içerik açıklaması zorunludur.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const content = await previewSCORMContent(formData);
      setPreviewContent(content);
      setShowPreview(true);
      setSuccessMessage('İçerik başarıyla oluşturuldu!');
    } catch (error) {
      setErrorMessage('İçerik oluşturulurken bir hata oluştu.');
      console.error('Generate error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setErrorMessage('');

    try {
      const { downloadSCORMPackage } = await import('@/lib/scormService');
      await downloadSCORMPackage(formData);
      setSuccessMessage('SCORM paketi başarıyla indirildi!');
    } catch (error) {
      setErrorMessage('SCORM paketi indirilirken bir hata oluştu.');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadToCloud = async () => {
    if (!isScormCloudConfigured()) {
      setErrorMessage('SCORM Cloud yapılandırması eksik. Lütfen API anahtarlarını kontrol edin.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const blob = await createSCORMPackage(formData);
      const courseId = `scorm_ai_${Date.now()}`;
      
      await createCourse(courseId, formData.title, blob);
      setSuccessMessage('İçerik başarıyla SCORM Cloud\'a yüklendi!');
    } catch (error) {
      setErrorMessage('SCORM Cloud\'a yüklenirken bir hata oluştu.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

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
              <Link href="/" className="flex items-center space-x-3">
                <div className="p-2 bg-primary-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-secondary-900">
                  SCORM AI
                </h1>
              </Link>
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

      <div className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Badge className="bg-primary-100 text-primary-700 border-primary-200">
                <Sparkles className="h-4 w-4 mr-2" />
                Yapay Zeka Destekli
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-secondary-900">
              SCORM İçerik Oluştur
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Yapay zeka teknolojisi ile profesyonel SCORM içerikleri oluşturun. 
              Sadece birkaç dakikada LMS sistemlerinize entegre edilebilir eğitim materyalleri hazırlayın.
            </p>
          </div>

          {/* Status Messages */}
          {successMessage && (
            <Alert className="mb-6 border-success-200 bg-success-50">
              <CheckCircle className="h-4 w-4 text-success-600" />
              <AlertDescription className="text-success-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mb-6 border-error-200 bg-error-50">
              <AlertCircle className="h-4 w-4 text-error-600" />
              <AlertDescription className="text-error-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Form */}
          <Tabs defaultValue="content" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-secondary-200 shadow-soft">
              <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                <FileText className="h-4 w-4" />
                İçerik Bilgileri
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                <Settings className="h-4 w-4" />
                Ayarlar
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                <Eye className="h-4 w-4" />
                Önizleme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card className="card">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-600 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl text-secondary-900">İçerik Bilgileri</CardTitle>
                  </div>
                  <CardDescription className="text-secondary-600">
                    SCORM içeriğiniz için temel bilgileri girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-secondary-700">
                        Başlık *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="İçerik başlığını girin"
                        className="input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAudience" className="text-sm font-medium text-secondary-700">
                        Hedef Kitle
                      </Label>
                      <Input
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                        placeholder="Örn: Lise öğrencileri, çalışanlar, vb."
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-secondary-700">
                      Açıklama
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="İçerik açıklamasını girin"
                      rows={3}
                      className="textarea"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningObjectives" className="text-sm font-medium text-secondary-700">
                      Öğrenme Hedefleri
                    </Label>
                    <Textarea
                      id="learningObjectives"
                      value={formData.learningObjectives}
                      onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                      placeholder="Her satıra bir öğrenme hedefi yazın"
                      rows={4}
                      className="textarea"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-sm font-medium text-secondary-700">
                      İçerik Açıklaması *
                    </Label>
                    <Textarea
                      id="prompt"
                      value={formData.prompt}
                      onChange={(e) => handleInputChange('prompt', e.target.value)}
                      placeholder="Oluşturulacak içeriğin detaylı açıklamasını yazın"
                      rows={5}
                      className="textarea"
                    />
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="card">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-success-600 rounded-lg">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl text-secondary-900">İçerik Ayarları</CardTitle>
                  </div>
                  <CardDescription className="text-secondary-600">
                    İçerik türü, zorluk seviyesi ve diğer ayarları belirleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contentType" className="text-sm font-medium text-secondary-700">
                        İçerik Türü
                      </Label>
                      <Select value={formData.contentType} onValueChange={(value) => handleInputChange('contentType', value)}>
                        <SelectTrigger className="select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Eğitim Kursu</SelectItem>
                          <SelectItem value="quiz">Quiz/Sınav</SelectItem>
                          <SelectItem value="presentation">Sunum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficultyLevel" className="text-sm font-medium text-secondary-700">
                        Zorluk Seviyesi
                      </Label>
                      <Select value={formData.difficultyLevel} onValueChange={(value) => handleInputChange('difficultyLevel', value)}>
                        <SelectTrigger className="select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Başlangıç</SelectItem>
                          <SelectItem value="intermediate">Orta</SelectItem>
                          <SelectItem value="advanced">İleri</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template" className="text-sm font-medium text-secondary-700">
                      Şablon
                    </Label>
                    <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
                      <SelectTrigger className="select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Klasik</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                      <Checkbox
                        id="includeQuiz"
                        checked={formData.includeQuiz}
                        onCheckedChange={(checked) => handleInputChange('includeQuiz', checked)}
                        className="border-secondary-300"
                      />
                      <Label htmlFor="includeQuiz" className="text-sm font-medium text-secondary-700">
                        Quiz ekle
                      </Label>
                    </div>

                    {formData.includeQuiz && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="numberOfQuestions" className="text-sm font-medium text-secondary-700">
                            Soru Sayısı
                        </Label>
                        <Input
                          id="numberOfQuestions"
                          type="number"
                          min="1"
                          max="20"
                          value={formData.numberOfQuestions}
                          onChange={(e) => handleInputChange('numberOfQuestions', parseInt(e.target.value))}
                          className="input"
                        />
                      </div>

                      {/* Puanlama Sistemi */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="minScore" className="text-sm font-medium text-secondary-700">
                            Min Puan
                          </Label>
                          <Input
                            id="minScore"
                            type="number"
                            min="0"
                            value={formData.minScore}
                            onChange={(e) => handleInputChange('minScore', parseInt(e.target.value))}
                            className="input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxScore" className="text-sm font-medium text-secondary-700">
                            Max Puan
                          </Label>
                          <Input
                            id="maxScore"
                            type="number"
                            min="1"
                            value={formData.maxScore}
                            onChange={(e) => handleInputChange('maxScore', parseInt(e.target.value))}
                            className="input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passingScore" className="text-sm font-medium text-secondary-700">
                            Geçme Puanı
                          </Label>
                          <Input
                            id="passingScore"
                            type="number"
                            min="0"
                            max={formData.maxScore}
                            value={formData.passingScore}
                            onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                            className="input"
                          />
                        </div>
                      </div>

                      {/* Deneme Ayarları */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maxAttempts" className="text-sm font-medium text-secondary-700">
                            Max Deneme Sayısı
                          </Label>
                          <Input
                            id="maxAttempts"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.maxAttempts}
                            onChange={(e) => handleInputChange('maxAttempts', parseInt(e.target.value))}
                            className="input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit" className="text-sm font-medium text-secondary-700">
                            Süre Limiti (dakika)
                          </Label>
                          <Input
                            id="timeLimit"
                            type="number"
                            min="0"
                            placeholder="0 = sınırsız"
                            value={formData.timeLimit || ''}
                            onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
                            className="input"
                          />
                        </div>
                      </div>

                      {/* Tekrar Deneme */}
                      <div className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                        <Checkbox
                          id="allowRetake"
                          checked={formData.allowRetake}
                          onCheckedChange={(checked) => handleInputChange('allowRetake', checked)}
                          className="border-secondary-300"
                        />
                        <Label htmlFor="allowRetake" className="text-sm font-medium text-secondary-700">
                          Tekrar denemeye izin ver
                        </Label>
                      </div>
                    </div>
                    )}

                    {/* İçerik Ayarları */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-secondary-900">İçerik Ayarları</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="slideCount" className="text-sm font-medium text-secondary-700">
                          Slayt Sayısı
                        </Label>
                        <Input
                          id="slideCount"
                          type="number"
                          min="3"
                          max="20"
                          value={formData.slideCount}
                          onChange={(e) => handleInputChange('slideCount', parseInt(e.target.value))}
                          className="input"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                          <Checkbox
                            id="includeAnimations"
                            checked={formData.includeAnimations}
                            onCheckedChange={(checked) => handleInputChange('includeAnimations', checked)}
                            className="border-secondary-300"
                          />
                          <Label htmlFor="includeAnimations" className="text-sm font-medium text-secondary-700">
                            Animasyonlar
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                          <Checkbox
                            id="includeInteractiveElements"
                            checked={formData.includeInteractiveElements}
                            onCheckedChange={(checked) => handleInputChange('includeInteractiveElements', checked)}
                            className="border-secondary-300"
                          />
                          <Label htmlFor="includeInteractiveElements" className="text-sm font-medium text-secondary-700">
                            İnteraktif Öğeler
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                          <Checkbox
                            id="includeAudio"
                            checked={formData.includeAudio}
                            onCheckedChange={(checked) => handleInputChange('includeAudio', checked)}
                            className="border-secondary-300"
                          />
                          <Label htmlFor="includeAudio" className="text-sm font-medium text-secondary-700">
                            Ses Desteği
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                          <Checkbox
                            id="includeVideo"
                            checked={formData.includeVideo}
                            onCheckedChange={(checked) => handleInputChange('includeVideo', checked)}
                            className="border-secondary-300"
                          />
                          <Label htmlFor="includeVideo" className="text-sm font-medium text-secondary-700">
                            Video Desteği
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card className="card">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-accent-600 rounded-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl text-secondary-900">Önizleme ve İndirme</CardTitle>
                  </div>
                  <CardDescription className="text-secondary-600">
                    İçeriği önizleyin ve SCORM paketi olarak indirin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="btn-primary flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                      {isGenerating ? 'Oluşturuluyor...' : 'İçerik Oluştur'}
                    </Button>

                    <Button 
                      onClick={handleDownload} 
                      disabled={isDownloading || !showPreview}
                      variant="outline"
                      className="btn-outline flex items-center gap-2"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isDownloading ? 'İndiriliyor...' : 'SCORM İndir'}
                    </Button>

                    {isScormCloudConfigured() && (
                      <Button 
                        onClick={handleUploadToCloud} 
                        disabled={isUploading || !showPreview}
                        variant="outline"
                        className="btn-outline flex items-center gap-2"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {isUploading ? 'Yükleniyor...' : 'Cloud\'a Yükle'}
                      </Button>
                    )}
                  </div>

                  {showPreview && previewContent && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="h-5 w-5 text-secondary-600" />
                        <h3 className="text-lg font-semibold text-secondary-900">İçerik Önizlemesi</h3>
                      </div>
                      <div 
                        className="border border-secondary-200 rounded-xl p-6 bg-white max-h-96 overflow-y-auto shadow-soft"
                        dangerouslySetInnerHTML={{ __html: previewContent }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}