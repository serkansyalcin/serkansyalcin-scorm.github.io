'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { downloadSCORMPackage, previewSCORMContent, SCORMGenerateData } from '@/lib/scormService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoCircledIcon, ReloadIcon, DownloadIcon } from '@radix-ui/react-icons';
import { isOpenAIConfigured } from '@/lib/openaiService';

export default function ResultPage() {
  const router = useRouter();
  
  // İçerik verisi ve önizleme durumu
  const [data, setData] = useState<SCORMGenerateData | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // OpenAI yapılandırma durumu
  const [isApiConfigured, setIsApiConfigured] = useState<boolean | null>(null);
  
  // Sayfa yüklendiğinde localStorage'dan verileri al
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // LocalStorage'dan verileri al
        const storedData = localStorage.getItem('scormData');
        
        if (!storedData) {
          throw new Error('İçerik verisi bulunamadı. Lütfen önce bir içerik oluşturun.');
        }
        
        // Verileri parse et
        const parsedData: SCORMGenerateData = JSON.parse(storedData);
        setData(parsedData);
        
        // API yapılandırmasını kontrol et
        const configured = await isOpenAIConfigured();
        setIsApiConfigured(configured);
        
        // İçeriği önizle
        const content = await previewSCORMContent(parsedData);
        setPreviewContent(content);
        
      } catch (err) {
        console.error('Hata:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // SCORM paketini indirme işlemi
  const handleDownload = async () => {
    if (!data) return;
    
    setIsDownloading(true);
    
    try {
      await downloadSCORMPackage(data);
    } catch (err) {
      console.error('İndirme hatası:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Yeni içerik oluşturmak için formu sıfırla ve yönlendir
  const handleCreateNew = () => {
    router.push('/create');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="text-center">
          <ReloadIcon className="h-10 w-10 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">İçerik oluşturuluyor...</h2>
          <p className="text-gray-500 mt-2">Bu işlem birkaç saniye sürebilir.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive" className="mb-6">
          <InfoCircledIcon className="h-4 w-4 mr-2" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button onClick={handleCreateNew} className="mt-4">
          Yeni İçerik Oluştur
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">SCORM İçeriği Hazır</h1>
      
      {isApiConfigured === false && (
        <Alert className="mb-6">
          <InfoCircledIcon className="h-4 w-4 mr-2" />
          <AlertTitle>OpenAI API Yapılandırması Eksik</AlertTitle>
          <AlertDescription>
            OpenAI API anahtarı yapılandırılmadı. Demo içerik kullanılmaktadır. Gerçek AI tarafından oluşturulan içerik için API anahtarınızı .env.local dosyasına ekleyin.
          </AlertDescription>
        </Alert>
      )}
      
      {data && (
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{data.title}</h2>
                  <p className="text-gray-500">{data.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownload} 
                    disabled={isDownloading}
                    className="flex items-center gap-1"
                  >
                    {isDownloading ? (
                      <ReloadIcon className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <DownloadIcon className="h-4 w-4 mr-1" />
                    )}
                    {isDownloading ? 'İndiriliyor...' : 'SCORM Paketi İndir'}
                  </Button>
                  
                  <Button variant="outline" onClick={handleCreateNew}>
                    Yeni İçerik Oluştur
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-100 font-medium border-b">
                  Önizleme
                </div>
                <div className="p-0" style={{ height: '600px' }}>
                  <iframe
                    srcDoc={previewContent}
                    title="SCORM İçeriği Önizleme"
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 