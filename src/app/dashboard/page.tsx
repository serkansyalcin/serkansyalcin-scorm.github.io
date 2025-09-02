'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Upload, 
  Settings, 
  BarChart3, 
  FileText,
  Cloud,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Users,
  Target,
  TrendingUp
} from 'lucide-react';
import { listCourses, isScormCloudConfigured } from '@/lib/scormCloudService';

interface SCORMCourse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'draft';
  template: string;
  difficultyLevel: string;
  contentType: string;
  downloadCount?: number;
  cloudUploaded?: boolean;
}

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [courses, setCourses] = useState<SCORMCourse[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [scormCloudConfigured, setScormCloudConfigured] = useState(false);

  useEffect(() => {
    loadCourses();
    setScormCloudConfigured(isScormCloudConfigured());
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      // LocalStorage'dan kursları yükle (gerçek uygulamada API'den gelecek)
      const savedCourses = localStorage.getItem('scorm_courses');
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      }

      // SCORM Cloud'tan kursları yükle (eğer yapılandırılmışsa)
      if (scormCloudConfigured) {
        try {
          const cloudCourses = await listCourses();
          // Cloud kurslarını local kurslarla birleştir
          console.log('Cloud courses:', cloudCourses);
        } catch (error) {
          console.error('Cloud courses yüklenemedi:', error);
        }
      }
    } catch (error) {
      console.error('Kurslar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success-100 text-success-800 border-success-200">Tamamlandı</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning-100 text-warning-800 border-warning-200">Devam Ediyor</Badge>;
      case 'draft':
        return <Badge className="bg-secondary-100 text-secondary-800 border-secondary-200">Taslak</Badge>;
      default:
        return <Badge className="bg-secondary-100 text-secondary-800 border-secondary-200">Bilinmiyor</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="outline" className="text-success-600 border-success-600">Başlangıç</Badge>;
      case 'intermediate':
        return <Badge variant="outline" className="text-warning-600 border-warning-600">Orta</Badge>;
      case 'advanced':
        return <Badge variant="outline" className="text-error-600 border-error-600">İleri</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <BarChart3 className="h-4 w-4" />;
      case 'presentation':
        return <Eye className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.status === 'completed').length,
    inProgress: courses.filter(c => c.status === 'in_progress').length,
    drafts: courses.filter(c => c.status === 'draft').length,
    cloudUploaded: courses.filter(c => c.cloudUploaded).length
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-5 h-5 text-white" />
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
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">Dashboard</h1>
                <p className="text-secondary-600">SCORM içeriklerinizi yönetin ve takip edin</p>
              </div>
              <Link href="/create">
                <Button className="btn-primary flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni İçerik Oluştur
                </Button>
              </Link>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-600">Toplam İçerik</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-success-100 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-success-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-600">Tamamlanan</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-warning-100 rounded-xl">
                    <Clock className="h-6 w-6 text-warning-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-600">Devam Eden</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary-100 rounded-xl">
                    <FileText className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-600">Taslaklar</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.drafts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <Cloud className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-600">Cloud'da</p>
                    <p className="text-2xl font-bold text-secondary-900">{stats.cloudUploaded}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-white border border-secondary-200 shadow-soft">
              <TabsTrigger value="courses" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                İçeriklerim
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                Analitik
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
                Ayarlar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-secondary-900">SCORM İçerikleri</CardTitle>
                  <CardDescription className="text-secondary-600">Oluşturduğunuz tüm SCORM içeriklerini görüntüleyin ve yönetin</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto p-4 bg-secondary-100 rounded-2xl w-fit mb-6">
                        <FileText className="h-12 w-12 text-secondary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">Henüz içerik oluşturmadınız</h3>
                      <p className="text-secondary-600 mb-6">İlk SCORM içeriğinizi oluşturmaya başlayın</p>
                      <Link href="/create">
                        <Button className="btn-primary">İçerik Oluştur</Button>
                      </Link>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-secondary-700">İçerik</TableHead>
                          <TableHead className="text-secondary-700">Durum</TableHead>
                          <TableHead className="text-secondary-700">Zorluk</TableHead>
                          <TableHead className="text-secondary-700">Şablon</TableHead>
                          <TableHead className="text-secondary-700">Oluşturulma</TableHead>
                          <TableHead className="text-secondary-700">İndirme</TableHead>
                          <TableHead className="text-secondary-700">İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id} className="hover:bg-secondary-50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                  {getContentTypeIcon(course.contentType)}
                                </div>
                                <div>
                                  <div className="font-medium text-secondary-900">{course.title}</div>
                                  <div className="text-sm text-secondary-500">{course.description}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(course.status)}</TableCell>
                            <TableCell>{getDifficultyBadge(course.difficultyLevel)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-secondary-200 text-secondary-700">
                                {course.template}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-secondary-500">
                              {formatDate(course.createdAt)}
                            </TableCell>
                            <TableCell className="text-sm text-secondary-500">
                              {course.downloadCount || 0} kez
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="btn-outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="btn-outline">
                                  <Download className="h-4 w-4" />
                                </Button>
                                {course.cloudUploaded && (
                                  <Button size="sm" variant="outline" className="btn-outline">
                                    <Cloud className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button size="sm" variant="outline" className="text-error-600 hover:text-error-700 border-error-200 hover:border-error-300">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card">
                  <CardHeader>
                    <CardTitle className="text-secondary-900">İçerik Dağılımı</CardTitle>
                    <CardDescription className="text-secondary-600">İçerik türlerine göre dağılım</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
                        <span className="text-sm font-medium text-secondary-700">Eğitim Kursları</span>
                        <span className="text-sm text-secondary-500">
                          {courses.filter(c => c.contentType === 'course').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
                        <span className="text-sm font-medium text-secondary-700">Quiz/Sınavlar</span>
                        <span className="text-sm text-secondary-500">
                          {courses.filter(c => c.contentType === 'quiz').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
                        <span className="text-sm font-medium text-secondary-700">Sunumlar</span>
                        <span className="text-sm text-secondary-500">
                          {courses.filter(c => c.contentType === 'presentation').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card">
                  <CardHeader>
                    <CardTitle className="text-secondary-900">Zorluk Seviyesi Dağılımı</CardTitle>
                    <CardDescription className="text-secondary-600">İçeriklerin zorluk seviyelerine göre dağılım</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
                        <span className="text-sm font-medium text-secondary-700">Başlangıç</span>
                        <span className="text-sm text-secondary-500">
                          {courses.filter(c => c.difficultyLevel === 'beginner').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
                        <span className="text-sm font-medium text-secondary-700">Orta</span>
                        <span className="text-sm text-secondary-500">
                          {courses.filter(c => c.difficultyLevel === 'intermediate').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
                        <span className="text-sm font-medium text-secondary-700">İleri</span>
                        <span className="text-sm text-secondary-500">
                          {courses.filter(c => c.difficultyLevel === 'advanced').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="text-secondary-900">SCORM Cloud Ayarları</CardTitle>
                  <CardDescription className="text-secondary-600">SCORM Cloud entegrasyonu için API ayarları</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl bg-secondary-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-100 rounded-lg">
                        <Cloud className="h-5 w-5 text-accent-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">SCORM Cloud Entegrasyonu</p>
                        <p className="text-sm text-secondary-500">
                          {scormCloudConfigured ? 'Yapılandırılmış' : 'Yapılandırılmamış'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={scormCloudConfigured ? 'default' : 'secondary'} className={scormCloudConfigured ? 'bg-success-100 text-success-800' : 'bg-secondary-100 text-secondary-800'}>
                      {scormCloudConfigured ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>

                  {!scormCloudConfigured && (
                    <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-warning-800">SCORM Cloud yapılandırılmamış</p>
                          <p className="text-sm text-warning-700 mt-1">
                            SCORM Cloud entegrasyonu için API anahtarlarınızı .env dosyasına ekleyin.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="btn-outline flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    API Ayarları
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}