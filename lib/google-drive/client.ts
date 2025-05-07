import { google } from 'googleapis';
import path from 'path';

// ตรวจสอบว่ามีการกำหนดค่า environment variables หรือไม่
if (!process.env.GOOGLE_DRIVE_CLIENT_EMAIL) {
  throw new Error('Missing environment variable: GOOGLE_DRIVE_CLIENT_EMAIL');
}

if (!process.env.GOOGLE_DRIVE_PRIVATE_KEY) {
  throw new Error('Missing environment variable: GOOGLE_DRIVE_PRIVATE_KEY');
}

// สร้าง Google Auth client
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
  key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// สร้าง Google Drive client
const drive = google.drive({ version: 'v3', auth });

// ฟังก์ชันสำหรับตรวจสอบประเภทไฟล์
export const getFileType = (fileName: string, mimeType: string): string => {
  // ตรวจสอบจากนามสกุลไฟล์
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // จัดกลุ่มประเภทไฟล์
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
    return 'video';
  } else if (extension === 'pdf') {
    return 'pdf';
  } else if (['doc', 'docx'].includes(extension)) {
    return 'word';
  } else if (['xls', 'xlsx'].includes(extension)) {
    return 'excel';
  } else {
    // ใช้ MIME type เป็นตัวช่วยในกรณีที่นามสกุลไม่ชัดเจน
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return 'word';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return 'excel';
    } else {
      return 'other';
    }
  }
};

// ฟังก์ชันสำหรับอัพโหลดไฟล์ไปยัง Google Drive
export const uploadToGoogleDrive = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ success: boolean; fileId?: string; webViewLink?: string; fileType?: string; error?: any }> => {
  try {
    const fileType = getFileType(fileName, mimeType);
    
    // เลือกโฟลเดอร์ตามประเภทไฟล์
    let folderId;
    switch (fileType) {
      case 'image':
        folderId = process.env.GOOGLE_DRIVE_IMAGES_FOLDER_ID;
        break;
      case 'video':
        folderId = process.env.GOOGLE_DRIVE_VIDEOS_FOLDER_ID;
        break;
      case 'pdf':
      case 'word':
      case 'excel':
        folderId = process.env.GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID;
        break;
      default:
        folderId = process.env.GOOGLE_DRIVE_OTHERS_FOLDER_ID;
    }
    
    if (!folderId) {
      throw new Error(`Folder ID for file type ${fileType} is not configured`);
    }
    
    // อัพโหลดไฟล์
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
        parents: [folderId]
      },
      media: {
        mimeType: mimeType,
        body: fileBuffer
      }
    });
    
    // ตั้งค่าการแชร์ไฟล์ให้สามารถเข้าถึงได้โดยไม่ต้องล็อกอิน
    await drive.permissions.create({
      fileId: response.data.id as string,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    // ดึงข้อมูล webViewLink
    const fileInfo = await drive.files.get({
      fileId: response.data.id as string,
      fields: 'webViewLink'
    });
    
    return {
      success: true,
      fileId: response.data.id,
      webViewLink: fileInfo.data.webViewLink,
      fileType
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return {
      success: false,
      error
    };
  }
};
