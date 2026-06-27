# Yêu cầu Website

| Yêu cầu | Trọng số nhân | Trọng số chia |
|---|---:|---:|
| Lưu trữ dữ liệu bằng database | 1 | 1 |
| Có chức năng đăng nhập, đăng xuất của người dùng với username, password; phân biệt 2 loại người dùng: `admin`, `user` | 1 | 1 |
| Có trang hiển thị nội dung khác nhau theo mã của nội dung (sản phẩm/bài viết/... tùy theo website lựa chọn) | 1 | 1 |
| └─ Có form bình luận và đánh giá cho nội dung đang xem, gồm: tên người, email, nội dung bình luận, điểm đánh giá | 0.5 | 0.5 |
| └─ Các bình luận và đánh giá sau khi gửi sẽ được hiển thị công khai | 0.5 | 0.5 |
| Ở trang chủ, sau 1 phút từ khi mở trang thì hiện quảng cáo một sản phẩm định trước dưới dạng popup | 1 | 1 |
| └─ Khi người dùng ấn nút đóng popup, lần sau mở trang sẽ không hiện lại popup này nữa (sử dụng cookie) | 0.5 | 0.5 |
| Trang giới thiệu và thông tin liên hệ | 0.5 | 0.5 |
| └─ Form gửi ý kiến liên hệ | 0.5 | 0.5 |
| Trang quản trị | 1 | 1 |
| └─ Hiển thị số lượng view của toàn bộ website | 0.5 | 0 |
| └─ Cho phép cập nhật thông tin ở các trang nội dung | 0.5 | 0 |
| └─ Cho phép hiển thị danh sách và xóa bình luận của người dùng | 0.5 | 0 |
| Giao diện responsive, cho phép tùy chỉnh layout với 3 ngưỡng phân biệt bởi các giá trị `800px`, `1200px` | 1 | 1 |
| Thiết kế và trình bày giao diện | 1 | 0 |
| Tổ chức project | 1 | 0 |
| Copy hoặc dùng các thư viện có sẵn *(penalty)* | -10 | 0 |
