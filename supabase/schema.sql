-- สร้างตาราง files สำหรับเก็บข้อมูลไฟล์
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  google_drive_id TEXT NOT NULL,
  google_drive_link TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- ฟิลด์เพิ่มเติม (ถ้าต้องการ)
  description TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT TRUE
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_files_file_type ON files(file_type);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

-- สร้าง Row Level Security (RLS) policies
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- อนุญาตให้ทุกคนอ่านข้อมูลได้
CREATE POLICY "Allow public read access" ON files
  FOR SELECT USING (is_public = TRUE);

-- อนุญาตให้เฉพาะ authenticated users สามารถเพิ่มข้อมูลได้
CREATE POLICY "Allow authenticated users to insert" ON files
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- อนุญาตให้เฉพาะเจ้าของไฟล์สามารถแก้ไขหรือลบข้อมูลได้
CREATE POLICY "Allow owners to update" ON files
  FOR UPDATE USING (auth.uid()::text = uploaded_by);

CREATE POLICY "Allow owners to delete" ON files
  FOR DELETE USING (auth.uid()::text = uploaded_by);

-- สร้างฟังก์ชันสำหรับค้นหาไฟล์
CREATE OR REPLACE FUNCTION search_files(search_term TEXT)
RETURNS SETOF files AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM files
  WHERE
    file_name ILIKE '%' || search_term || '%'
    OR file_type ILIKE '%' || search_term || '%'
    OR description ILIKE '%' || search_term || '%'
  ORDER BY uploaded_at DESC;
END;
$$ LANGUAGE plpgsql;
