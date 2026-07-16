# Hướng dẫn chỉnh sửa nội dung Portfolio

Toàn bộ nội dung hiển thị trên website (chữ, số liệu, dự án, thông tin liên hệ, ảnh)
đều nằm trong **một file duy nhất**:

```
content/content.json
```

Bạn **không cần biết code**. Chỉ cần sửa file này ngay trên github.com, lưu lại,
và Vercel sẽ **tự động cập nhật website** sau 1–2 phút.

---

## 1. Cách sửa nội dung trên github.com (không cần cài gì cả)

1. Mở repository trên **github.com** và vào file `content/content.json`.
2. Bấm biểu tượng **cây bút chì ✏️ (Edit this file)** ở góc trên bên phải.
3. Sửa nội dung bạn muốn (xem ví dụ bên dưới).
4. Kéo xuống cuối trang, mục **Commit changes**:
   - Ô đầu: ghi ngắn gọn bạn vừa sửa gì (ví dụ: `Cập nhật số liệu K-Tech`).
   - Bấm nút xanh **Commit changes**.
5. Xong! **Vercel tự động deploy** lại website. Đợi khoảng **1–2 phút** rồi tải lại
   trang web là thấy thay đổi.

> ⚠️ **Lưu ý quan trọng về cú pháp JSON:**
> - Mỗi đoạn chữ phải nằm trong dấu ngoặc kép `"..."`.
> - Các mục cách nhau bằng dấu phẩy `,` — **trừ mục cuối cùng** thì không có dấu phẩy.
> - Không xóa nhầm dấu `{ }`, `[ ]`, `"` hoặc dấu phẩy.
> - Nếu GitHub báo lỗi hoặc web không cập nhật, thường là do thừa/thiếu một dấu phẩy.
>   Bạn có thể kiểm tra nhanh bằng cách dán nội dung vào <https://jsonlint.com>.

---

## 2. Đổi số liệu (ví dụ: sửa "174K+ impressions")

Số liệu nằm trong mục `stats` của mỗi project. Mỗi số liệu là một cặp
`["con số", "chú thích"]`:

```json
"stats": [
  ["174K+", "impressions"],
  ["129K+", "engagements"],
  ["5K+", "total leads"],
  ["33%", "of registrations via Meta Ads"]
]
```

👉 Muốn đổi `174K+` thành `200K+`, chỉ cần sửa:

```json
  ["200K+", "impressions"],
```

---

## 3. Sửa mô tả / đoạn văn

- `short`: đoạn mô tả ngắn hiển thị ở trang chủ và đầu trang dự án.
- `overview`, `challenge`, `solution`, `results`: là **danh sách các gạch đầu dòng**.

Ví dụ sửa phần Challenge:

```json
"challenge": [
  "Câu gạch đầu dòng thứ nhất.",
  "Câu gạch đầu dòng thứ hai."
]
```

👉 **Thêm một gạch đầu dòng mới**: thêm một dòng trong ngoặc kép và nhớ dấu phẩy:

```json
"challenge": [
  "Câu cũ.",
  "Câu mới bạn vừa thêm."
]
```

👉 **In đậm một cụm từ**: bọc trong thẻ `<b>...</b>`:

```json
"Contributed <b>33% of total registrations</b> via Meta Ads."
```

---

## 4. Thêm 1 project mới

Mỗi project là một khối `{ ... }` nằm trong danh sách `projects`.
Cách dễ nhất: **copy nguyên một project có sẵn**, dán xuống dưới (nhớ dấu phẩy ngăn
cách giữa các project), rồi sửa nội dung. Cấu trúc một project:

```json
{
  "id": "ten-duong-dan",                     // dùng cho URL: /project/ten-duong-dan (chữ thường, không dấu, không cách)
  "num": "07 / CATEGORY",                    // số thứ tự + loại dự án
  "title": "Tên dự án — Mô tả ngắn",
  "short": "Một câu tóm tắt dự án.",
  "tags": ["Kỹ năng 1", "Kỹ năng 2"],
  "colors": { "bg": "#1b2340", "fg": "#dfe6ff", "accent": "#7da2ff" },
  "cover": "/assets/ten-anh.jpg",            // ảnh bìa (xem mục 5)
  "overview": ["Đoạn giới thiệu."],
  "challenge": ["Thử thách."],
  "solution": ["Giải pháp."],
  "stats": [["Số", "Chú thích"]],
  "results": ["Kết quả đạt được."],
  "gallery": [
    ["/assets/anh-1.jpg", "Chú thích ảnh 1"],
    ["/assets/anh-2.jpg", "Chú thích ảnh 2", 1]
  ]
}
```

Giải thích các trường:
- `id`: chuỗi định danh, xuất hiện trong đường link. Không được trùng với project khác.
- `colors`: `bg` = màu nền khối, `fg` = màu chữ trên nền đó, `accent` = màu nhấn (số liệu, chấm tròn).
- `gallery`: mỗi ảnh là `["đường-dẫn-ảnh", "chú thích"]`. Thêm số `1` ở cuối
  (`["...", "...", 1]`) để ảnh chiếm **toàn bộ chiều ngang**.

> Trang chủ và các trang chi tiết được tạo **tự động** từ danh sách này — thêm một
> project là website sẽ tự có thêm một khối và một trang mới.

---

## 5. Thay ảnh trong /public/assets/

Tất cả ảnh nằm trong thư mục:

```
public/assets/
```

Trong `content.json`, đường dẫn ảnh luôn bắt đầu bằng `/assets/...`
(ví dụ `/assets/ktech-ads.jpg`).

**Cách thêm hoặc thay ảnh trên github.com:**

1. Mở thư mục `public/assets/` trên github.com.
2. Bấm **Add file → Upload files**, kéo thả ảnh mới vào, rồi **Commit changes**.
   - Nên đặt tên ảnh không dấu, không khoảng trắng (ví dụ: `ktech-ads.jpg`).
   - Nên dùng ảnh ngang tỉ lệ **16:9** để hiển thị đẹp nhất.
3. Trong `content.json`, trỏ tới ảnh mới bằng đường dẫn `/assets/ten-anh-moi.jpg`:

```json
"cover": "/assets/ten-anh-moi.jpg"
```

👉 **Thay ảnh cũ mà không đổi tên**: chỉ cần upload ảnh mới **trùng tên** với ảnh cũ,
website sẽ tự dùng ảnh mới, không cần sửa `content.json`.

---

## 6. Các nội dung khác (tiêu đề, liên hệ)

- **Tiêu đề trang chủ / phụ đề**: mục `hero` trong `content.json`.
- **Email, số điện thoại, địa chỉ, mạng xã hội**: mục `contact`.
- **Tên logo, menu điều hướng**: mục `site`.

Sửa y hệt cách ở trên: đổi chữ trong ngoặc kép rồi **Commit changes**.

---

## Tóm tắt

| Bạn muốn | Sửa ở đâu |
|---|---|
| Đổi số liệu | `stats` trong `content.json` |
| Sửa mô tả | `short`, `overview`, `challenge`, `solution`, `results` |
| Thêm project | Thêm một khối `{ }` vào `projects` |
| Thay ảnh | Upload vào `public/assets/` + trỏ đường dẫn `/assets/...` |
| Đổi email/liên hệ | `contact` trong `content.json` |

Mỗi lần **Commit changes** trên GitHub → **Vercel tự động deploy** → đợi 1–2 phút → xong. 🎉
