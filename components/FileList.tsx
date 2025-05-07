'use client';

import { useState, useEffect } from 'react';
// ฟังก์ชันช่วยสำหรับแปลงขนาดไฟล์
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
  else return (bytes / 1073741824).toFixed(2) + ' GB';
};

// กำหนดประเภทข้อมูลสำหรับไฟล์
interface File {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  size_bytes: number;
  google_drive_link: string;
  uploaded_by: string;
  uploaded_at: string;
}

// คอมโพเนนต์สำหรับแสดงรายการไฟล์
export default function FileList() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // โหลดข้อมูลไฟล์
  const loadFiles = async (type: string = '', search: string = '') => {
    try {
      setLoading(true);

      let url = '/api/files';
      const params = new URLSearchParams();

      if (type) {
        params.append('type', type);
      }

      if (search) {
        params.append('search', search);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    loadFiles();
  }, []);

  // ค้นหาไฟล์
  const handleSearch = () => {
    loadFiles(selectedType, searchTerm);
  };

  // กรองตามประเภทไฟล์
  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    loadFiles(type, searchTerm);
  };

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

  // แปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่าย
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="max-w-2xl mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center" style={{
          color: '#B78DF2'
        }}>รายการไฟล์ที่อัพโหลด</h2>

        {/* ส่วนค้นหา */}
        <div className="w-full max-w-xs mx-auto mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาไฟล์..."
              className="w-full p-2 rounded-md text-sm"
              style={{
                background: 'rgba(35, 21, 64, 0.5)',
                color: '#fff',
                border: '1px solid rgba(100, 75, 191, 0.3)',
                outline: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
              style={{ color: '#B78DF2' }}
              onClick={handleSearch}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* ส่วนกรอง */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className="px-3 py-1.5 rounded-full text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedType === '' ? '#644BBF' : 'rgba(35, 21, 64, 0.5)',
              color: selectedType === '' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
            }}
            onClick={() => handleTypeFilter('')}
          >
            ทั้งหมด
          </button>
          <button
            className="px-3 py-1.5 rounded-full text-sm transition-all duration-200 flex items-center"
            style={{
              backgroundColor: selectedType === 'image' ? '#644BBF' : 'rgba(35, 21, 64, 0.5)',
              color: selectedType === 'image' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
            }}
            onClick={() => handleTypeFilter('image')}
          >
            <span className="mr-1">🖼️</span> รูปภาพ
          </button>
          <button
            className="px-3 py-1.5 rounded-full text-sm transition-all duration-200 flex items-center"
            style={{
              backgroundColor: selectedType === 'video' ? '#644BBF' : 'rgba(35, 21, 64, 0.5)',
              color: selectedType === 'video' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
            }}
            onClick={() => handleTypeFilter('video')}
          >
            <span className="mr-1">🎬</span> วิดีโอ
          </button>
          <button
            className="px-3 py-1.5 rounded-full text-sm transition-all duration-200 flex items-center"
            style={{
              backgroundColor: selectedType === 'pdf' ? '#644BBF' : 'rgba(35, 21, 64, 0.5)',
              color: selectedType === 'pdf' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
            }}
            onClick={() => handleTypeFilter('pdf')}
          >
            <span className="mr-1">📄</span> PDF
          </button>
          <button
            className="px-3 py-1.5 rounded-full text-sm transition-all duration-200 flex items-center"
            style={{
              backgroundColor: selectedType === 'word' ? '#644BBF' : 'rgba(35, 21, 64, 0.5)',
              color: selectedType === 'word' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
            }}
            onClick={() => handleTypeFilter('word')}
          >
            <span className="mr-1">📝</span> Word
          </button>
          <button
            className="px-3 py-1.5 rounded-full text-sm transition-all duration-200 flex items-center"
            style={{
              backgroundColor: selectedType === 'excel' ? '#644BBF' : 'rgba(35, 21, 64, 0.5)',
              color: selectedType === 'excel' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
            }}
            onClick={() => handleTypeFilter('excel')}
          >
            <span className="mr-1">📊</span> Excel
          </button>
        </div>
      </div>

      {/* แสดงข้อความโหลดหรือข้อผิดพลาด */}
      {loading && (
        <div className="flex justify-center items-center py-8 flex-grow">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#B78DF2', borderTopColor: 'transparent' }}></div>
          <p className="ml-3 text-sm opacity-80">กำลังโหลดข้อมูล...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-lg p-3 my-3">
          <p className="text-center text-sm" style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
      )}

      {/* แสดงรายการไฟล์ */}
      {!loading && !error && (
        <div className="flex-grow">
          {files.length === 0 ? (
            <div className="text-center py-12 rounded-lg flex flex-col items-center justify-center h-full max-w-md mx-auto" style={{ background: 'rgba(35, 21, 64, 0.3)' }}>
              <p className="text-lg opacity-70">ไม่พบไฟล์ที่ต้องการ</p>
              <p className="text-sm mt-2 opacity-50">ลองค้นหาด้วยคำค้นอื่น หรือดูไฟล์ทั้งหมด</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-250px)] max-w-2xl mx-auto">
              {files.map((file) => (
                <div key={file.id} className="rounded-lg overflow-hidden transition-all duration-200 hover:translate-y-[-4px] hover:shadow-lg"
                  style={{ background: '#311F73', border: '1px solid rgba(183, 141, 242, 0.2)' }}>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full mr-3 flex-shrink-0"
                        style={{ background: 'rgba(100, 75, 191, 0.3)' }}>
                        <span className="text-xl">{getFileIcon(file.file_type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" title={file.file_name}>{file.file_name}</p>
                        <p className="text-xs opacity-60">{formatFileSize(file.size_bytes)}</p>
                      </div>
                    </div>
                    <p className="text-xs opacity-60 mb-4">{formatDate(file.uploaded_at)}</p>
                  </div>
                  <div className="border-t border-opacity-20" style={{ borderColor: '#644BBF' }}>
                    <a
                      href={file.google_drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-2 text-center text-sm transition-all duration-200 hover:bg-opacity-80"
                      style={{
                        color: '#B78DF2'
                      }}
                    >
                      เปิดไฟล์
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
