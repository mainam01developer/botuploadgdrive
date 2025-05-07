import FileList from '../components/FileList';
import FileStats from '../components/FileStats';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center" style={{
      background: '#231540',
      color: '#fff'
    }}>
      <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight" style={{
            color: '#B78DF2',
            letterSpacing: '-0.02em'
          }}>
            LINE Bot File Uploader
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-80 font-light">
            อัพโหลดไฟล์ผ่าน LINE Bot ไปยัง Google Drive และจัดการไฟล์ของคุณได้อย่างง่ายดาย
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6 max-w-sm mx-auto lg:mx-0">
              <FileStats />

              <div className="rounded-lg overflow-hidden" style={{
                background: '#311F73',
                border: '1px solid rgba(183, 141, 242, 0.2)'
              }}>
                <div className="p-4 border-b border-opacity-20" style={{ borderColor: '#644BBF' }}>
                  <h2 className="text-lg font-medium" style={{
                    color: '#B78DF2'
                  }}>วิธีใช้งาน</h2>
                </div>
                <div className="p-4">
                  <ol className="list-none space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm" style={{ background: '#644BBF' }}>1</span>
                      </div>
                      <div>
                        <p>เพิ่มเพื่อน LINE Bot ของเรา</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm" style={{ background: '#644BBF' }}>2</span>
                      </div>
                      <div>
                        <p>ส่งไฟล์ที่ต้องการอัพโหลดไปยัง LINE Bot</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm" style={{ background: '#644BBF' }}>3</span>
                      </div>
                      <div>
                        <p>ระบบจะอัพโหลดไฟล์ไปยัง Google Drive โดยอัตโนมัติ</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm" style={{ background: '#644BBF' }}>4</span>
                      </div>
                      <div>
                        <p>ดูรายการไฟล์ทั้งหมดได้ที่หน้าเว็บนี้</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden" style={{
                background: '#311F73',
                border: '1px solid rgba(183, 141, 242, 0.2)'
              }}>
                <div className="p-4 border-b border-opacity-20" style={{ borderColor: '#644BBF' }}>
                  <h2 className="text-lg font-medium" style={{
                    color: '#B78DF2'
                  }}>ประเภทไฟล์ที่รองรับ</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full mr-3 flex-shrink-0"
                        style={{ background: 'rgba(100, 75, 191, 0.3)' }}>
                        <span>🖼️</span>
                      </div>
                      <div>
                        <p className="font-medium">รูปภาพ</p>
                        <p className="text-xs opacity-60">JPG, JPEG, PNG, GIF, WEBP</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full mr-3 flex-shrink-0"
                        style={{ background: 'rgba(100, 75, 191, 0.3)' }}>
                        <span>🎬</span>
                      </div>
                      <div>
                        <p className="font-medium">วิดีโอ</p>
                        <p className="text-xs opacity-60">MP4, MOV, AVI, WEBM</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full mr-3 flex-shrink-0"
                        style={{ background: 'rgba(100, 75, 191, 0.3)' }}>
                        <span>📄</span>
                      </div>
                      <div>
                        <p className="font-medium">เอกสาร</p>
                        <p className="text-xs opacity-60">PDF, DOC, DOCX, XLS, XLSX</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full mr-3 flex-shrink-0"
                        style={{ background: 'rgba(100, 75, 191, 0.3)' }}>
                        <span>📁</span>
                      </div>
                      <div>
                        <p className="font-medium">อื่นๆ</p>
                        <p className="text-xs opacity-60">รองรับทุกประเภทไฟล์</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-lg p-6" style={{
            background: '#311F73',
            border: '1px solid rgba(183, 141, 242, 0.2)'
          }}>
            <FileList />
          </div>
        </div>
      </div>
    </main>
  );
}
