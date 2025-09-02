import axios from 'axios';
import FormData from 'form-data';

// SCORM Cloud API temel URL'i
const SCORM_CLOUD_API_URL = 'https://cloud.scorm.com/api/v2/';

// API yapılandırması
const SCORM_CLOUD_APP_ID = process.env.SCORM_CLOUD_APP_ID || '';
const SCORM_CLOUD_SECRET_KEY = process.env.SCORM_CLOUD_SECRET_KEY || '';

// API anahtarlarının yapılandırılmış olup olmadığını kontrol et
export const isScormCloudConfigured = (): boolean => {
  return !!SCORM_CLOUD_APP_ID && !!SCORM_CLOUD_SECRET_KEY;
};

// SCORM Cloud API istemcisi
const scormCloudApi = axios.create({
  baseURL: SCORM_CLOUD_API_URL,
  auth: {
    username: SCORM_CLOUD_APP_ID,
    password: SCORM_CLOUD_SECRET_KEY
  }
});

// Kullanılabilir kursları listele
export const listCourses = async () => {
  try {
    const response = await scormCloudApi.get('courses');
    return response.data;
  } catch (error) {
    console.error("SCORM Cloud kurs listesi hatası:", error);
    throw new Error("Kurslar listelenirken bir hata oluştu.");
  }
};

// Kurs oluştur
export const createCourse = async (courseId: string, title: string, zipFile: Blob) => {
  try {
    // Önce kursu oluştur
    await scormCloudApi.post('courses', {
      courseId,
      title,
      tags: ["SCORM-AI-Generated"]
    });
    
    // Sonra ZIP dosyasını yükle
    const formData = new FormData();
    formData.append('file', zipFile, `${courseId}.zip`);
    
    await scormCloudApi.post(`courses/${courseId}/importJobs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      success: true,
      courseId
    };
  } catch (error) {
    console.error("SCORM Cloud kurs oluşturma hatası:", error);
    throw new Error("Kurs oluşturulurken bir hata oluştu.");
  }
};

// Kurs silme
export const deleteCourse = async (courseId: string) => {
  try {
    await scormCloudApi.delete(`courses/${courseId}`);
    return {
      success: true
    };
  } catch (error) {
    console.error("SCORM Cloud kurs silme hatası:", error);
    throw new Error("Kurs silinirken bir hata oluştu.");
  }
};

// Kurs için lansman URL'i oluştur
export const getLaunchUrl = async (courseId: string, redirectOnExit: string) => {
  try {
    const response = await scormCloudApi.post(`courses/${courseId}/launch`, {
      redirectOnExitUrl: redirectOnExit
    });
    
    return response.data.launchLink;
  } catch (error) {
    console.error("SCORM Cloud lansman URL hatası:", error);
    throw new Error("Lansman URL'i oluşturulurken bir hata oluştu.");
  }
};

// Kurs için ilerleme raporunu al
export const getCourseProgress = async (courseId: string) => {
  try {
    const response = await scormCloudApi.get(`courses/${courseId}/progress`);
    return response.data;
  } catch (error) {
    console.error("SCORM Cloud ilerleme raporu hatası:", error);
    throw new Error("İlerleme raporu alınırken bir hata oluştu.");
  }
}; 