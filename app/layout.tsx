import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LINE Bot File Uploader',
  description: 'อัพโหลดไฟล์ผ่าน LINE Bot ไปยัง Google Drive และจัดการไฟล์ของคุณ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {children}
        <footer className="py-4 mt-8" style={{ background: '#231540', borderTop: '1px solid rgba(100, 75, 191, 0.2)' }}>
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm" style={{ color: '#B78DF2' }}>© {new Date().getFullYear()} LINE Bot File Uploader</p>
            <p className="text-xs mt-1 opacity-50" style={{ color: '#fff' }}>
              ระบบอัพโหลดไฟล์ผ่าน LINE Bot ไปยัง Google Drive
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
