import { Client, middleware, WebhookEvent, MessageEvent, TextMessage } from '@line/bot-sdk';
import axios from 'axios';

// ตรวจสอบว่ามีการกำหนดค่า environment variables หรือไม่
if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error('Missing environment variable: LINE_CHANNEL_ACCESS_TOKEN');
}

if (!process.env.LINE_CHANNEL_SECRET) {
  throw new Error('Missing environment variable: LINE_CHANNEL_SECRET');
}

// กำหนดค่า config สำหรับ LINE Bot
export const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// สร้าง LINE client
export const lineClient = new Client(lineConfig);

// สร้าง middleware สำหรับตรวจสอบ signature ของ LINE
export const lineMiddleware = middleware(lineConfig);

// ฟังก์ชันสำหรับดาวน์โหลดไฟล์จาก LINE
export const downloadLineContent = async (messageId: string): Promise<{ buffer: Buffer; contentType: string }> => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${lineConfig.channelAccessToken}`
      }
    });

    return {
      buffer: Buffer.from(response.data),
      contentType: response.headers['content-type']
    };
  } catch (error) {
    console.error('Error downloading content from LINE:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับส่งข้อความตอบกลับเมื่ออัพโหลดสำเร็จ
export const sendSuccessMessage = async (userId: string, fileData: {
  fileName: string;
  fileType: string;
  sizeBytes: number;
  googleDriveLink: string;
}) => {
  try {
    await lineClient.pushMessage(userId, [
      {
        type: 'text',
        text: `✅ อัพโหลดไฟล์สำเร็จ!\nชื่อไฟล์: ${fileData.fileName}\nประเภท: ${fileData.fileType}\nขนาด: ${formatFileSize(fileData.sizeBytes)}`
      },
      {
        type: 'text',
        text: `เข้าถึงไฟล์ได้ที่: ${fileData.googleDriveLink}`
      }
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error sending LINE success message:', error);
    return { success: false, error };
  }
};

// ฟังก์ชันสำหรับส่งข้อความตอบกลับเมื่อเกิดข้อผิดพลาด
export const sendErrorMessage = async (userId: string, errorMessage: string) => {
  try {
    await lineClient.pushMessage(userId, {
      type: 'text',
      text: `❌ เกิดข้อผิดพลาดในการอัพโหลดไฟล์: ${errorMessage}\n\nกรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ`
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending LINE error message:', error);
    return { success: false, error };
  }
};

// ฟังก์ชันช่วยสำหรับแปลงขนาดไฟล์
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
  else return (bytes / 1073741824).toFixed(2) + ' GB';
};

// ฟังก์ชันสำหรับตรวจสอบขนาดไฟล์ (ไม่มีการจำกัดขนาดไฟล์)
export const checkFileSize = (fileType: string, sizeBytes: number): { valid: boolean; message?: string } => {
  // ไม่มีการจำกัดขนาดไฟล์
  return { valid: true };
};
