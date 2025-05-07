import { NextRequest, NextResponse } from 'next/server';
import { getAllFiles, getFilesByType, searchFilesByName, getFileStats } from '../../../lib/supabase/client';

// API Route Handler สำหรับดึงข้อมูลไฟล์ทั้งหมด
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const fileType = searchParams.get('type');
    const searchTerm = searchParams.get('search');
    const stats = searchParams.get('stats');

    // ถ้ามีการขอสถิติ
    if (stats === 'true') {
      const result = await getFileStats();
      if (!result.success) {
        return NextResponse.json({ error: 'Failed to fetch file stats' }, { status: 500 });
      }
      return NextResponse.json(result.data);
    }

    // ถ้ามีการค้นหา
    if (searchTerm) {
      const result = await searchFilesByName(searchTerm);
      if (!result.success) {
        return NextResponse.json({ error: 'Failed to search files' }, { status: 500 });
      }
      return NextResponse.json(result.data);
    }

    // ถ้ามีการกรองตามประเภท
    if (fileType) {
      const result = await getFilesByType(fileType);
      if (!result.success) {
        return NextResponse.json({ error: 'Failed to fetch files by type' }, { status: 500 });
      }
      return NextResponse.json(result.data);
    }

    // ดึงข้อมูลไฟล์ทั้งหมด
    const result = await getAllFiles();
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
