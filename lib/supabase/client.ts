import { createClient } from '@supabase/supabase-js';

// ตรวจสอบว่ามีการกำหนดค่า environment variables หรือไม่
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// สร้าง Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ฟังก์ชันสำหรับบันทึกข้อมูลไฟล์ลงใน Supabase
export const saveFileInfo = async (fileData: {
  fileName: string;
  fileType: string;
  mimeType: string;
  sizeBytes: number;
  googleDriveId: string;
  googleDriveLink: string;
  uploadedBy: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('files')
      .insert({
        file_name: fileData.fileName,
        file_type: fileData.fileType,
        mime_type: fileData.mimeType,
        size_bytes: fileData.sizeBytes,
        google_drive_id: fileData.googleDriveId,
        google_drive_link: fileData.googleDriveLink,
        uploaded_by: fileData.uploadedBy,
        uploaded_at: new Date()
      });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    return { success: false, error };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลไฟล์ทั้งหมด
export const getAllFiles = async () => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('uploaded_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching files from Supabase:', error);
    return { success: false, error };
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลไฟล์ตามประเภท
export const getFilesByType = async (fileType: string) => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('file_type', fileType)
      .order('uploaded_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching files by type from Supabase:', error);
    return { success: false, error };
  }
};

// ฟังก์ชันสำหรับค้นหาไฟล์ตามชื่อ
export const searchFilesByName = async (searchTerm: string) => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .ilike('file_name', `%${searchTerm}%`)
      .order('uploaded_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error searching files from Supabase:', error);
    return { success: false, error };
  }
};

// ฟังก์ชันสำหรับดึงสถิติไฟล์
export const getFileStats = async () => {
  try {
    // ดึงจำนวนไฟล์ทั้งหมด
    const { data: totalFiles, error: totalError } = await supabase
      .from('files')
      .select('id', { count: 'exact' });
      
    if (totalError) throw totalError;
    
    // ดึงจำนวนไฟล์แยกตามประเภท
    const { data: filesByType, error: typeError } = await supabase
      .from('files')
      .select('file_type, id')
      .order('file_type');
      
    if (typeError) throw typeError;
    
    // นับจำนวนไฟล์แต่ละประเภท
    const fileTypeCounts: Record<string, number> = {};
    filesByType?.forEach(file => {
      const type = file.file_type;
      fileTypeCounts[type] = (fileTypeCounts[type] || 0) + 1;
    });
    
    return { 
      success: true, 
      data: {
        totalFiles: totalFiles?.length || 0,
        fileTypeCounts
      }
    };
  } catch (error) {
    console.error('Error getting file stats from Supabase:', error);
    return { success: false, error };
  }
};
