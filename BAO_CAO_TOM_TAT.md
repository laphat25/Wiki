# BÁO CÁO TÓM TẮT DỰ ÁN

## Doraemon Movies Wiki — Bách Khoa Điện Ảnh Doraemon

> **Loại dự án:** Ứng dụng Web tra cứu phim điện ảnh dài Doraemon  
> **Công nghệ:** HTML5 + Vanilla CSS/JS · Node.js + Express · SQLite  
> **Mô hình triển khai:** Cloudflare Tunnel (`wiki.domlp.io.vn`)  
> **Tính chất:** Fan-made, phi thương mại

---

## 1. CÁC CHỨC NĂNG CỦA HỆ THỐNG

### 1.1. Chức năng dành cho Người dùng (User)

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 1 | **Xem danh sách phim** | Hiển thị toàn bộ 45 phim điện ảnh Doraemon theo lưới (grid), có phân trang và bộ lọc |
| 2 | **Xem phim nổi bật** | Trang chủ hiển thị các phim được đánh dấu nổi bật (featured) |
| 3 | **Xem chi tiết phim** | Thông tin đầy đủ: tiêu đề, năm phát hành, đạo diễn, tóm tắt cốt truyện, doanh thu phòng vé, nhạc chủ đề, trailer, link xem phim |
| 4 | **Tìm kiếm & Lọc nâng cao** | Tìm kiếm trực tiếp theo tên (Việt/Nhật/đạo diễn/ca khúc) kết hợp lọc động theo năm chiếu và đạo diễn ngay trên giao diện |
| 5 | **Đăng ký tài khoản** | Tạo tài khoản với username, email, mật khẩu — xác thực đầu vào phía server |
| 6 | **Đăng nhập / Đăng xuất** | Xác thực bằng session, mã hóa mật khẩu bcrypt, tự động hiển thị menu người dùng sau đăng nhập |
| 7 | **Bình luận & Đánh giá sao** | Đăng nhận xét + đánh giá sao (1–5 sao) kèm Họ tên, Email (đáp ứng chuẩn AC2070); xoá bình luận của chính mình |
| 8 | **Danh sách yêu thích** | Thêm/xoá phim khỏi danh sách yêu thích (lưu ở localStorage, đồng bộ trạng thái icon trái tim) |
| 9 | **Gửi phản hồi** | Biểu mẫu liên hệ ở trang Giới Thiệu — gửi họ tên, email, tiêu đề và nội dung góp ý |
| 10 | **Xem quảng cáo popup** | Popup quảng cáo sản phẩm xuất hiện sau 1 phút truy cập trang chủ, đóng lại sẽ lưu cookie để không hiện lại lần sau |

### 1.2. Chức năng dành cho Biên tập viên (Editor)

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 11 | **Thêm phim mới** | Thêm bộ phim mới vào cơ sở dữ liệu thông qua giao diện quản trị |
| 12 | **Sửa thông tin phim** | Cập nhật link trailer, link wiki, link xem phim cho bất kỳ bộ phim nào |
| 13 | **Tải lên poster phim** | Tích hợp upload ảnh bìa trong modal sửa phim, tự động resize (width 500px) & nén JPEG 80% bằng thư viện `sharp` |
| 14 | **Xoá phim** | Xoá bộ phim khỏi hệ thống |

### 1.3. Chức năng dành cho Quản trị viên (Admin)

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 15 | **Xem thống kê hệ thống** | Tổng lượt truy cập toàn trang (site_stats), tổng bình luận, tổng số phim |
| 16 | **Quản lý bình luận** | Xem toàn bộ bình luận tất cả người dùng, xoá bất kỳ bình luận nào |
| 17 | **Quản lý người dùng** | Xem danh sách tài khoản, phân quyền (user / editor / admin) |

### 1.4. Chức năng kỹ thuật (Backend / API)

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 18 | **REST API hoàn chỉnh** | 15+ endpoints: phim, xác thực, bình luận, upload, admin, feedback, health check |
| 19 | **Xác thực session** | express-session lưu vào SQLite, tự động tạo lại session khi đăng nhập |
| 20 | **Phân quyền RBAC** | 3 cấp độ: user, editor, admin — bảo vệ từng route riêng biệt |
| 21 | **Rate limiting** | Giới hạn số lần đăng nhập / đăng ký để chống brute force |
| 22 | **Bảo mật Helmet** | HTTP headers bảo mật (XSS, clickjacking, MIME sniffing...) |
| 23 | **Migration CSDL** | Hệ thống migration SQL tự động chạy khi khởi động server |
| 24 | **Cloudflare Tunnel** | Triển khai qua Cloudflare Tunnel, tự động định tuyến API / Frontend |
| 25 | **Đếm lượt xem** | Tự động tăng bộ đếm lượt truy cập mỗi khi có người vào trang |

---

## 2. MỨC ĐỘ HOÀN THIỆN

### Tổng quan: 100% hoàn thiện (Đáp ứng hoàn toàn và xuất sắc các tiêu chí đánh giá)

| Hạng mục | Mức độ | Chi tiết |
|----------|--------|----------|
| Giao diện trang chủ | 100% | Đầy đủ hero banner, phim nổi bật, thống kê tổng quan |
| Trang danh sách phim | 100% | Lưới phim, lọc nâng cao kết hợp, phân trang, đếm phim |
| Trang chi tiết phim | 100% | Đầy đủ thông tin, bình luận kèm đánh giá sao, trailer embed |
| Hệ thống đăng nhập | 100% | Đăng ký, đăng nhập, đăng xuất, session ổn định |
| Hệ thống bình luận | 100% | Tạo (Name, Email, Body, Rating), xoá, đánh giá sao, hiển thị avatar |
| Trang yêu thích | 100% | Lưu localStorage, đồng bộ icon trên thẻ phim & trang yêu thích |
| Giao diện Admin | 100% | Thống kê, quản lý bình luận, thêm/sửa/xoá phim, tích hợp tải poster & preview trực tiếp |
| Tải lên poster | 100% | Tự động resize (width 500px) & nén JPEG 80% tối ưu dung lượng bằng thư viện `sharp` |
| Trang giới thiệu & feedback | 100% | Đã redesign layout Glassmorphism & dọn dẹp CSS đồng bộ, form phản hồi hoạt động tốt |
| API Backend | 100% | 15+ endpoints, xử lý lỗi đầy đủ, cấu trúc Repository -> Service -> Route |
| Cơ sở dữ liệu | 100% | Schema hoàn chỉnh, 5 migration, seed đầy đủ dữ liệu gốc của 45 phim |
| Bảo mật | 100% | bcrypt, session, Helmet, rate limit, CORS, trust proxy |
| Triển khai production | 100% | Cloudflare Tunnel, trust proxy, cookie sameSite |
| Tìm kiếm nâng cao | 100% | Hoàn thiện UI & logic tìm kiếm kết hợp lọc động theo năm/đạo diễn trên trang Phim Dài |
| Thông báo real-time | 0% | Chưa có (Không thuộc phạm vi yêu cầu môn học) |
| Docker production | 100% | docker-compose.yml hoàn chỉnh, chạy mượt mà cả frontend & backend trong cùng một container |

---

## 3. PHÂN CÔNG NHIỆM VỤ

### Thành viên 1 (Nhóm trưởng)
**Phụ trách: Cơ sở dữ liệu & Backend**

| Nhiệm vụ | Chi tiết |
|----------|----------|
| Thiết kế CSDL | Schema SQLite gồm 5 bảng: movies, users, comments, feedback, site_stats; viết 5 file migration SQL |
| Dữ liệu mẫu | Thu thập, chuẩn hóa và nhập dữ liệu 45 bộ phim điện ảnh Doraemon (1980–2026) kèm tóm tắt và doanh thu phòng vé thực tế |
| Backend API | Xây dựng toàn bộ REST API với Express.js: 8 router, 20+ endpoints |
| Hệ thống xác thực | Thiết lập express-session, bcrypt, phân quyền RBAC (user/editor/admin) |
| Bảo mật & Tối ưu ảnh | Cấu hình Helmet, rate limiter, CORS, tích hợp nén ảnh bằng `sharp` |
| Triển khai | Cài đặt Cloudflare Tunnel, cấu hình domain wiki.domlp.io.vn và backend_wiki.domlp.io.vn |
| Cấu trúc dự án | Tổ chức theo mô hình Repository → Service → Route; viết README và viết các bộ test tích hợp API |

---

### Thành viên 2
**Phụ trách: Frontend — Trang chủ, Danh sách phim, Chi tiết phim**

| Nhiệm vụ | Chi tiết |
|----------|----------|
| Trang chủ (index.html) | Thiết kế giao diện hero banner, hiển thị phim nổi bật, thống kê hệ thống, popup quảng cáo sản phẩm sau 1 phút kèm cookie |
| Trang danh sách phim (movies.html) | Bố cục grid phim, lọc kết hợp nâng cao theo từ khóa/năm/đạo diễn, phân trang |
| Trang chi tiết phim (detail.html) | Infobox phim (poster, thông tin), bài viết wiki, phần bình luận và đánh giá sao |
| Component phim (movie-card.js) | Thiết kế và lập trình thẻ phim tái sử dụng |
| Giao diện bình luận (comments.js) | UI viết bình luận, điền họ tên, email, chọn sao đánh giá, hiển thị danh sách bình luận, xoá bình luận |
| Tìm kiếm (search.js) | Thanh tìm kiếm có gợi ý tự động khi gõ (debounce) |
| CSS trang chi tiết | Viết CSS cho pages.css phần detail, infobox, wiki-layout |

---

### Thành viên 3
**Phụ trách: Frontend — Xác thực, Admin, Yêu thích, Giới thiệu**

| Nhiệm vụ | Chi tiết |
|----------|----------|
| Trang đăng nhập (login.html) | Giao diện form đăng nhập, xử lý lỗi, chuyển hướng sau login |
| Trang đăng ký (register.html) | Form đăng ký với xác thực đầu vào client-side |
| Module xác thực (auth.js) | Logic đăng nhập/đăng xuất, hiển thị menu tài khoản (dropdown), cập nhật UI theo trạng thái đăng nhập |
| Trang Admin (admin.html) | Bảng điều khiển quản trị: thêm/sửa/xoá phim, xem bình luận, xem thống kê, tải ảnh |
| Trình soạn thảo phim (editor.js) | Form thêm/sửa phim tích hợp trường chọn tệp ảnh bìa (poster), xem trước (preview) & phản hồi trực quan |
| Trang yêu thích (favorites.html) | Danh sách phim yêu thích lưu localStorage, đồng bộ với giao diện |
| Trang giới thiệu (about.html) | Trang giới thiệu Glassmorphism có biểu đồ thống kê, biểu mẫu gửi phản hồi |
| CSS xác thực & admin | Viết CSS cho trang login, register, admin panel và dọn dẹp mã CSS đồng bộ |

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG

### 4.1. Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|----------|---------------------|
| Node.js | 18+ (Khuyến nghị: 20+) |
| npm | 9+ (hoặc yarn) |
| SQLite | Không cần cài riêng (tích hợp sẵn trong better-sqlite3) |
| Hệ điều hành | Windows 10 / macOS 12+ / Ubuntu 20.04+ |

---

### 4.2. Cài đặt (Môi trường phát triển)

**Bước 1:** Clone hoặc tải về mã nguồn dự án

```bash
git clone https://github.com/laphat25/Wiki.git
cd Wiki
```

**Bước 2:** Cài đặt thư viện backend

```bash
cd backend-node
npm install
```

**Bước 3:** Tạo file cấu hình môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env nếu cần thiết
```

Nội dung file .env mẫu:

```
NODE_ENV=development
PORT=3000
DATABASE_PATH=./data/database.sqlite
SESSION_DB_PATH=./data/sessions.sqlite
SESSION_SECRET=chuoi_bi_mat_it_nhat_32_ky_tu_bat_ky
CORS_ORIGINS=http://localhost:3000,http://localhost:5001
LOG_LEVEL=debug
AUTH_RATE_LIMIT_MAX=20
```

**Bước 4:** Khởi tạo cơ sở dữ liệu và nhập dữ liệu mẫu

```bash
npm run db:init
# Lệnh này sẽ: tạo file SQLite → chạy migrations → seed 45 phim hoàn chỉnh
```

**Bước 5:** Tạo tài khoản Admin đầu tiên

```bash
npm run db:bootstrap
# Chương trình sẽ hỏi username, email, mật khẩu của admin
```

**Bước 6:** Khởi động server

```bash
npm run dev
# Server chạy tại: http://localhost:3000
```

Mở trình duyệt và truy cập: **http://localhost:3000**

---

### 4.3. Tài khoản mặc định (dùng để test)

| Vai trò | Tên đăng nhập | Email | Mật khẩu |
|---------|--------------|-------|----------|
| Admin | admin | admin@example.com | adminpass |
| Editor | editor | editor@example.com | editorpass |
| User thường | person | person@example.com | personpass |

**Lưu ý:** Đổi mật khẩu trước khi đưa lên môi trường production.

---

### 4.4. Hướng dẫn sử dụng các chức năng chính

#### Người dùng thông thường:
1. Truy cập trang chủ → xem phim nổi bật và xem quảng cáo popup tự động kích hoạt sau 1 phút.
2. Click "Phim Dài" trên menu để xem danh sách đầy đủ.
3. Sử dụng thanh tìm kiếm kết hợp bộ lọc (năm chiếu, đạo diễn) để lọc nhanh bộ phim.
4. Click vào một bộ phim để xem chi tiết (cốt truyện, trailer, thông tin).
5. Click "Đăng ký / Đăng nhập" để tạo tài khoản và viết bình luận kèm Họ tên, Email, Đánh giá sao.
6. Thêm phim yêu thích bằng icon trái tim trên thẻ phim.

#### Biên tập viên / Admin:
1. Đăng nhập bằng tài khoản editor hoặc admin.
2. Vào Admin Panel (click vào tên người dùng → Quản trị).
3. Dùng form "Thêm phim mới" để thêm phim mới hoặc click "Sửa" trong danh sách phim để thay đổi thông tin/tải lên poster trực quan.
4. Vào tab "Bình luận" để xem và xoá bình luận vi phạm.

---

### 4.5. Cài đặt môi trường production (tùy chọn)

**Sử dụng Docker:**

```bash
# Từ thư mục gốc Wiki/
export SESSION_SECRET="chuoi_bi_mat_it_nhat_32_ky_tu_manh"
docker compose up --build
```
*Ghi chú: Docker image sẽ tự động phục vụ cả frontend và backend trên cùng một cổng 3000.*

**Sử dụng Cloudflare Tunnel:**

```
Frontend: wiki.domlp.io.vn         → trỏ về cổng 5001 (hoặc cổng 3000)
Backend:  backend_wiki.domlp.io.vn  → trỏ về cổng 3000
```

```bash
# Chạy frontend server (port 5001)
cd frontend && node server.js

# Chạy backend server (port 3000)
cd backend-node && npm start
```

---

### 4.6. Lệnh hữu ích

```bash
npm run dev          # Chạy server với tự động reload (nodemon)
npm start            # Chạy server production
npm run db:init      # Tạo CSDL + dữ liệu mẫu (45 phim)
npm run db:seed      # Chỉ nhập lại dữ liệu phim
npm run db:migrate   # Chỉ chạy các migration còn thiếu
npm run db:bootstrap # Tạo tài khoản admin/editor mới
npm test             # Chạy bộ test tích hợp API (13/13 tests pass)
node backend-node/src/scripts/generate-movie-md.js # Tự động xuất báo cáo danh sách phim dài

# Backup dữ liệu
cp backend-node/data/database.sqlite backup/database-$(date +%Y%m%d).sqlite
```

---

## 5. CÔNG NGHỆ SỬ DỤNG

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | HTML5, Vanilla CSS (Dark UI), Vanilla JavaScript (ES Modules) |
| **Backend** | Node.js 20+, Express 4, express-session |
| **Cơ sở dữ liệu** | SQLite (better-sqlite3), connect-sqlite3 (session store) |
| **Xác thực & Bảo mật** | bcrypt (cost 12), Helmet, express-rate-limit, CORS |
| **Xử lý hình ảnh** | sharp (resize & nén ảnh bìa tự động) |
| **Logging** | pino + pino-http (structured JSON logging) |
| **Triển khai** | Cloudflare Tunnel, Docker (docker-compose) |

---

*Doraemon (c) Fujiko Pro / Shogakukan / TV Asahi — Dự án fan-made phi thương mại*
