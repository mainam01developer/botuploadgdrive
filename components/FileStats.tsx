'use client';

import { useState, useEffect } from 'react';

// กำหนดประเภทข้อมูลสำหรับสถิติไฟล์
interface FileStats {
  totalFiles: number;
  fileTypeCounts: Record<string, number>;
}

// คอมโพเนนต์สำหรับแสดงสถิติไฟล์
export default function FileStats() {
  const [stats, setStats] = useState<FileStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลสถิติ
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/files?stats=true');

        if (!response.ok) {
          throw new Error('Failed to fetch file stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // แสดงไอคอนตามประเภทไฟล์
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'pdf':
        return '📄';
      case 'word':
        return '📝';
      case 'excel':
        return '📊';
      default:
        return '📁';
    }
  };

  // แปลงชื่อประเภทไฟล์เป็นภาษาไทย
  const getFileTypeName = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return 'รูปภาพ';
      case 'video':
        return 'วิดีโอ';
      case 'pdf':
        return 'PDF';
      case 'word':
        return 'Word';
      case 'excel':
        return 'Excel';
      default:
        return 'อื่นๆ';
    }
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{
      background: '#311F73',
      border: '1px solid rgba(183, 141, 242, 0.2)'
    }}>
      <div className="p-4 border-b border-opacity-20" style={{ borderColor: '#644BBF' }}>
        <h2 className="text-lg font-medium" style={{
          color: '#B78DF2'
        }}>สถิติไฟล์</h2>
      </div>

      <div className="p-4">
        {/* แสดงข้อความโหลดหรือข้อผิดพลาด */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#B78DF2', borderTopColor: 'transparent' }}></div>
            <p className="ml-3 text-sm opacity-80">กำลังโหลดข้อมูล...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded p-3 my-3">
            <p className="text-center text-sm" style={{ color: '#ff6b6b' }}>{error}</p>
          </div>
        )}

        {/* แสดงสถิติ */}
        {!loading && !error && stats && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm opacity-70">จำนวนไฟล์ทั้งหมด</p>
                <p className="text-3xl font-bold" style={{ color: '#B78DF2' }}>{stats.totalFiles}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: 'rgba(100, 75, 191, 0.2)' }}>
                <span className="text-2xl">📊</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">จำนวนไฟล์แต่ละประเภท</h3>

              {Object.entries(stats.fileTypeCounts).length === 0 ? (
                <div className="text-center p-4 rounded text-sm opacity-60" style={{ background: 'rgba(35, 21, 64, 0.3)' }}>
                  ไม่มีข้อมูล
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.fileTypeCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(100, 75, 191, 0.1)', paddingBottom: '0.5rem' }}>
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full mr-3 flex-shrink-0"
                          style={{ background: 'rgba(100, 75, 191, 0.2)' }}>
                          <span>{getFileIcon(type)}</span>
                        </div>
                        <span className="text-sm">{getFileTypeName(type)}</span>
                      </div>
                      <span className="font-bold" style={{ color: '#B78DF2' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
