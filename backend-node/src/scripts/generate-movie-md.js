const fs = require('fs');
const path = require('path');
const { getMoviesSeedData } = require('../db/seeds/movies-data');

function generateMarkdown() {
  const movies = getMoviesSeedData();
  let md = `# Danh sách Phim điện ảnh Doraemon (1980 — 2026)

Bảng tổng hợp chi tiết toàn bộ **45 tác phẩm điện ảnh dài** của thương hiệu Doraemon đã được số hóa và lưu trữ đồng bộ trong cơ sở dữ liệu hệ thống **DoraemonWiki**.

| ID | Tên phim tiếng Việt | Tên gốc tiếng Nhật | Năm chiếu | Ngày chiếu cụ thể | Đạo diễn | Ước tính Doanh thu | Ca khúc chủ đề | Nổi bật |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :--- | :---: |
`;

  movies.forEach(m => {
    const featuredEmoji = m.is_featured ? '🌟 Có' : 'Không';
    md += `| **${m.id}** | [${m.title_vi}](detail.html?id=${m.id}) | *${m.title_jp || '—'}* | **${m.release_year}** | ${m.release_date || '—'} | ${m.director || '—'} | ${m.box_office || '—'} | ${m.theme_song || '—'} | ${featuredEmoji} |\n`;
  });

  md += `
---
*Dữ liệu được cập nhật tự động từ cơ sở dữ liệu hạt giống hệ thống DoraemonWiki.*
`;

  const outputPath = path.join(__dirname, '../../../Danh_sach_phim_dien_anh_Doraemon.md');
  fs.writeFileSync(outputPath, md, 'utf8');
  console.log('✅ Generated markdown file successfully at:', outputPath);
}

generateMarkdown();
