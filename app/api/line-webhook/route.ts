import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent, MessageEvent, TextMessage } from '@line/bot-sdk';
import { lineConfig, lineClient, downloadLineContent, sendSuccessMessage, sendErrorMessage, checkFileSize } from '../../../lib/line/client';
import { uploadToGoogleDrive } from '../../../lib/google-drive/client';
import { saveFileInfo } from '../../../lib/supabase/client';
import crypto from 'crypto';

// ฟังก์ชันสำหรับตรวจสอบ signature ของ LINE
const verifySignature = (body: string, signature: string): boolean => {
  const hmac = crypto.createHmac('sha256', lineConfig.channelSecret);
  const digest = hmac.update(body).digest('base64');
  return digest === signature;
};

// ฟังก์ชันสำหรับจัดการกับเหตุการณ์ที่ได้รับจาก LINE
const handleEvent = async (event: WebhookEvent): Promise<void> => {
  // ตรวจสอบว่าเป็นเหตุการณ์ประเภทข้อความหรือไม่
  if (event.type !== 'message') {
    return;
  }

  const { message, source } = event;
  const userId = source.userId || 'unknown';

  // ตรวจสอบว่าเป็นข้อความประเภทไฟล์หรือไม่
  if (message.type === 'file' || message.type === 'image' || message.type === 'video' || message.type === 'audio') {
    try {
      // ดาวน์โหลดไฟล์จาก LINE
      const { buffer, contentType } = await downloadLineContent(message.id);

      // กำหนดชื่อไฟล์
      let fileName = '';
      if (message.type === 'file' && 'fileName' in message) {
        fileName = message.fileName;
      } else {
        // สร้างชื่อไฟล์จากประเภทและเวลา
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = contentType.split('/')[1];
        fileName = `${message.type}_${timestamp}.${extension}`;
      }

      // ตรวจสอบขนาดไฟล์
      const fileSize = buffer.length;
      const fileType = message.type === 'file' ? 'file' : message.type;
      const fileSizeCheck = checkFileSize(fileType, fileSize);

      if (!fileSizeCheck.valid) {
        await sendErrorMessage(userId, fileSizeCheck.message || 'ไฟล์มีขนาดใหญ่เกินไป');
        return;
      }

      // อัพโหลดไฟล์ไปยัง Google Drive
      const uploadResult = await uploadToGoogleDrive(buffer, fileName, contentType);

      if (!uploadResult.success) {
        await sendErrorMessage(userId, 'ไม่สามารถอัพโหลดไฟล์ไปยัง Google Drive ได้');
        return;
      }

      // บันทึกข้อมูลไฟล์ลงใน Supabase
      const saveResult = await saveFileInfo({
        fileName,
        fileType: uploadResult.fileType || 'unknown',
        mimeType: contentType,
        sizeBytes: fileSize,
        googleDriveId: uploadResult.fileId || '',
        googleDriveLink: uploadResult.webViewLink || '',
        uploadedBy: userId
      });

      if (!saveResult.success) {
        await sendErrorMessage(userId, 'อัพโหลดไฟล์สำเร็จแต่ไม่สามารถบันทึกข้อมูลได้');
        return;
      }

      // ส่งข้อความแจ้งสำเร็จ
      await sendSuccessMessage(userId, {
        fileName,
        fileType: uploadResult.fileType || 'unknown',
        sizeBytes: fileSize,
        googleDriveLink: uploadResult.webViewLink || ''
      });

    } catch (error) {
      console.error('Error handling file message:', error);
      await sendErrorMessage(userId, 'เกิดข้อผิดพลาดในการประมวลผลไฟล์');
    }
  } else if (message.type === 'text') {
    // ตอบกลับข้อความทั่วไป
    const textMessage = message as TextMessage;
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: `ส่งไฟล์มาให้ฉันเพื่ออัพโหลดไปยัง Google Drive\nรองรับไฟล์ประเภท: รูปภาพ, วิดีโอ, เอกสาร PDF, Word, Excel และอื่นๆ`
    });
  }
};

// API Route Handler
export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบ signature
    const signature = req.headers.get('x-line-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const body = await req.text();
    const isValid = verifySignature(body, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // แปลงข้อมูลเป็น JSON
    const webhookData = JSON.parse(body);

    // ประมวลผลเหตุการณ์ทั้งหมด
    await Promise.all(webhookData.events.map(handleEvent));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
