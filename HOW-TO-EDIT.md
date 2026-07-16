# Hướng dẫn chỉnh sửa nội dung Portfolio

Toàn bộ nội dung website nằm trong **một file duy nhất**:

```
content/content.json
```

Bạn **không cần biết code**. Sửa file này trên github.com → **Commit changes** →
**Vercel tự động deploy** lại website sau 1–2 phút.

Cấu trúc nội dung có 3 cấp lồng nhau:

```
project (dự án)  →  section (TAB dạng viên thuốc)  →  group (tiểu mục trong tab)  →  block (khối nội dung)
```

- **project**: một dự án. Hiện ra ở trang chủ và có trang riêng `/project/<id>`.
- **section**: hiển thị thành **một TAB** ở trang dự án.
- **group**: một **tiểu mục** (có tiêu đề phụ, hoặc `"title": null` = không có tiêu đề) bên trong tab.
- **block**: khối nội dung, có 3 loại:
  - `"text"` — danh sách gạch đầu dòng.
  - `"stats"` — các con số lớn `["giá trị", "chú thích"]`.
  - `"gallery"` — ảnh `["đường-dẫn", "chú thích"]` (thêm số `1` ở cuối để ảnh rộng hết khổ).

> ⚠️ **Cú pháp JSON:** mỗi đoạn chữ nằm trong `"..."`; các mục cách nhau bằng dấu phẩy `,`
> **trừ mục cuối** thì không có phẩy; không xóa nhầm `{ } [ ] "` hoặc dấu phẩy.
> Nếu web không cập nhật, thường do thừa/thiếu một dấu phẩy — kiểm tra nhanh tại <https://jsonlint.com>.

---

## 🌐 SONG NGỮ (EN / VI)

Website có **2 ngôn ngữ**: Tiếng Anh (EN) và Tiếng Việt (VI), chuyển bằng nút **EN | VI**
trên thanh menu. Vì vậy **mỗi đoạn chữ đều có 2 phiên bản**, viết dưới dạng:

```json
{ "en": "Câu tiếng Anh", "vi": "Câu tiếng Việt" }
```

Ví dụ tiêu đề dự án:

```json
"title": { "en": "Social Media", "vi": "Truyền thông Mạng xã hội" }
```

Áp dụng cho **mọi chữ người xem đọc được**: tiêu đề/mô tả dự án, nhãn tab (`label`),
tiêu đề tiểu mục (`title`), từng dòng `text`, **chú thích** của `stats` và `gallery`.

**Quy tắc:**
- ✏️ **Sửa một câu ở cả 2 ngôn ngữ** → sửa cả `"en"` và `"vi"`:
  ```json
  { "en": "New English sentence.", "vi": "Câu tiếng Việt mới." }
  ```
- 🇻🇳 **Chỉ dùng bản Việt / chưa có bản Anh** → chỉ cần sửa `"vi"`. Nếu để trống hoặc
  bỏ `"vi"`, website sẽ tự dùng bản `"en"` thay thế (không bao giờ bị trống chữ).
- 🔤 **Tên riêng giữ nguyên 1 ngôn ngữ**: những nhãn là tên riêng (ví dụ `"Meta Ads"`,
  `"Claude Code"`, `"LinkedIn"`) được viết dưới dạng **chuỗi thường** (không cần `{en, vi}`)
  vì giống nhau ở cả 2 ngôn ngữ. Bạn có thể để nguyên như vậy.
- 🔢 **Con số KHÔNG dịch**: trong `stats`, phần con số (ví dụ `"26.7M"`) giữ nguyên,
  chỉ có **chú thích** đi kèm là `{en, vi}`:
  ```json
  ["26.7M", { "en": "views in 4 months", "vi": "lượt xem trong 4 tháng" }]
  ```

> 💡 Muốn website chỉ hiển thị tiếng Việt cho khách của bạn? Cứ dịch hết phần `"vi"`;
> người xem có thể tự chọn EN nếu muốn.

---

## 🔀 BẬT / TẮT bất kỳ phần nào (`enabled`)

Mỗi **project**, **section (tab)** và **group** đều có cờ `"enabled"`:

- `"enabled": true` → hiển thị.
- `"enabled": false` → **ẩn hoàn toàn** (khỏi trang chủ, khỏi tab bar, khỏi trang dự án).

Số thứ tự dự án (01, 02, 03…) được **tự động đánh lại** chỉ dựa trên các dự án đang bật.
Tắt một dự án ở giữa → các dự án sau tự dồn số lại, không bị trống.

---

## 📑 MỤC LỤC — vị trí chính xác trong content.json

Đường dẫn dùng chỉ số **bắt đầu từ 0**: `projects[0]` là dự án đầu tiên.
Ô "text/số liệu" luôn nằm ở `...blocks[j].items`.

### `projects[0]` — AI & Marketing Automation  (id `ai-automation`)
| Tab (section) | Group (tiểu mục) | Đường dẫn JSON |
|---|---|---|
| Overview `sections[0]` | (không tiêu đề) | `projects[0].sections[0].groups[0]` |
| Personal Project `sections[1]` | Pet Care App | `projects[0].sections[1].groups[0]` |
| K-Tech Tools `sections[2]` | Landing Page | `projects[0].sections[2].groups[0]` |
| K-Tech Tools `sections[2]` | Data Dashboard | `projects[0].sections[2].groups[1]` |
| K-Tech Tools `sections[2]` | Auto Email | `projects[0].sections[2].groups[2]` |

### `projects[1]` — K-Tech College  (id `k-tech`)
| Tab (section) | Group (tiểu mục) | Đường dẫn JSON |
|---|---|---|
| Overview `sections[0]` | (giới thiệu) | `projects[1].sections[0].groups[0]` |
| Overview `sections[0]` | Challenge | `projects[1].sections[0].groups[1]` |
| Overview `sections[0]` | Results (số liệu) | `projects[1].sections[0].groups[2]` |
| Overview `sections[0]` | (link chéo → AI tools) | `projects[1].sections[0].groups[3]` |
| Paid Channel `sections[1]` | Meta Ads | `projects[1].sections[1].groups[0]` |
| Paid Channel `sections[1]` | LinkedIn Promoted Jobs | `projects[1].sections[1].groups[1]` |
| Paid Channel `sections[1]` | Hiring Platforms | `projects[1].sections[1].groups[2]` |
| Free Channel `sections[2]` | Social Media | `projects[1].sections[2].groups[0]` |
| Free Channel `sections[2]` | Community | `projects[1].sections[2].groups[1]` |
| Free Channel `sections[2]` | Seeding | `projects[1].sections[2].groups[2]` |
| Free Channel `sections[2]` | Hiring Platforms — organic | `projects[1].sections[2].groups[3]` |
| Free Channel `sections[2]` | University Partnerships | `projects[1].sections[2].groups[4]` |
| Events `sections[3]` | Offline Events | `projects[1].sections[3].groups[0]` |
| Events `sections[3]` | Online Events | `projects[1].sections[3].groups[1]` |

### `projects[2]` — Copywriter Projects  (id `copywriter`)
| Tab (section) | Group (tiểu mục) | Đường dẫn JSON |
|---|---|---|
| Overview `sections[0]` | (vai trò) | `projects[2].sections[0].groups[0]` |
| Overview `sections[0]` | Responsibilities | `projects[2].sections[0].groups[1]` |
| Overview `sections[0]` | Challenge | `projects[2].sections[0].groups[2]` |
| Overview `sections[0]` | Clients (ảnh) | `projects[2].sections[0].groups[3]` |
| Overview `sections[0]` | Results (số liệu) | `projects[2].sections[0].groups[4]` |
| imoo Watch Phone `sections[1]` | (không tiêu đề) | `projects[2].sections[1].groups[0]` |
| FROMCAUDAT Coffee `sections[2]` | (không tiêu đề) | `projects[2].sections[2].groups[0]` |

### `projects[3]` — Social Media  (id `social-media`)
| Tab (section) | Group (tiểu mục) | Đường dẫn JSON |
|---|---|---|
| Overview `sections[0]` | (tóm tắt + số liệu) | `projects[3].sections[0].groups[0]` |
| Facebook Growth `sections[1]` | Approach & Strategy | `projects[3].sections[1].groups[0]` |
| Facebook Growth `sections[1]` | Cong Dong Da Sac Page | `projects[3].sections[1].groups[1]` |
| Facebook Growth `sections[1]` | WAN Creative Network Page | `projects[3].sections[1].groups[2]` |
| TikTok Management `sections[2]` | Approach | `projects[3].sections[2].groups[0]` |
| TikTok Management `sections[2]` | Results & Highlights | `projects[3].sections[2].groups[1]` |

### `projects[4]` — Other & University Projects  (id `university`)
| Tab (section) | Group (tiểu mục) | Đường dẫn JSON |
|---|---|---|
| Overview `sections[0]` | (giới thiệu + số liệu) | `projects[4].sections[0].groups[0]` |
| Cre8Vibe Event `sections[1]` | (giới thiệu) | `projects[4].sections[1].groups[0]` |
| Cre8Vibe Event `sections[1]` | Challenge | `projects[4].sections[1].groups[1]` |
| Cre8Vibe Event `sections[1]` | Solution | `projects[4].sections[1].groups[2]` |
| Cre8Vibe Event `sections[1]` | Results (số liệu) | `projects[4].sections[1].groups[3]` |
| Brown Delight Branding `sections[2]` | (giới thiệu) | `projects[4].sections[2].groups[0]` |
| Brown Delight Branding `sections[2]` | Challenge | `projects[4].sections[2].groups[1]` |
| Brown Delight Branding `sections[2]` | Solution | `projects[4].sections[2].groups[2]` |
| Brown Delight Branding `sections[2]` | Results (số liệu) | `projects[4].sections[2].groups[3]` |

> Ngoài ra: `site` (logo, menu), `hero` (tiêu đề trang chủ + nút CTA), `about`
> (phần "Về tôi" — xem ngay dưới đây) và `contact` (email, SĐT, địa chỉ, mạng
> xã hội) nằm ở đầu file.
>
> 🔕 **Đã bỏ "eyebrow" (nhãn xanh nhỏ in hoa phía trên mỗi mục, ví dụ "VỀ TÔI"
> / "CONTACT").** Toàn site không còn nhãn này nữa, nên trường `contact.eyebrow`
> đã được **xoá khỏi `content.json`** — bạn không cần thêm lại. Muốn có tiêu đề
> cho một mục thì dùng `heading` (đối với `contact`) là đủ.

---

## 👤 PHẦN "VỀ TÔI" (`about`)

Nằm ở đầu file, ngay sau `hero`. Đây là phần giới thiệu bản thân hiển thị giữa
kệ dự án và các khối dự án ở trang chủ. Ảnh chân dung để trong `public/assets/`
(mặc định `avatar.png` — chỉ cần **upload đè ảnh cùng tên** để thay ảnh thật).

```json
"about": {
  "name": "Nguyễn Thị Minh Thu",
  "role":   { "en": "Marketing · AI Automation", "vi": "Marketing · Tự động hoá AI" },
  "avatar": "/assets/avatar.png",
  "traits": [
    { "en": "Marketer", "vi": "Marketer" }
  ],
  "summary": { "en": "Short bio (2-3 sentences).", "vi": "Tiểu sử ngắn (2-3 câu)." },
  "flipLine": {
    "enabled": true,
    "prefix": { "en": "I make your marketing ", "vi": "Mình giúp marketing của bạn " },
    "words": [
      { "en": "more creative", "vi": "sáng tạo hơn" },
      { "en": "more measurable", "vi": "đo lường được" }
    ],
    "suffix": { "en": "", "vi": "" }
  },
  "experience": [
    {
      "period": "05/2025 – 07/2026",
      "title":  { "en": "Marketing Executive", "vi": "Chuyên viên Marketing" },
      "org": "LIKELION Vietnam"
    }
  ],
  "education": [
    {
      "school": "HUFLIT University",
      "degree": { "en": "BBA in Marketing", "vi": "Cử nhân Quản trị Marketing" },
      "year": "2024",
      "gpa": "3.0"
    }
  ],
  "skills": ["Content Strategy", "Meta Ads"],
  "tools":  ["Canva", "Claude Code", "GitHub"],
  "languages": [
    { "name": { "en": "Vietnamese", "vi": "Tiếng Việt" },
      "level": { "en": "Native", "vi": "Bản ngữ" }, "value": 100 }
  ]
}
```

| Trường | Ý nghĩa |
|---|---|
| `name` | Tên hiển thị (giữ nguyên 1 bản, không cần `{en, vi}`). |
| `role` | Chức danh ngắn — song ngữ `{en, vi}`. |
| `avatar` | Đường dẫn ảnh chân dung trong `/assets/`. Thay ảnh: upload đè ảnh cùng tên. |
| `traits` | Các "nhãn" nhỏ nổi trên đầu ảnh (mỗi cái là `{en, vi}`). Thêm/bớt tuỳ ý. |
| `summary` | Tiểu sử 2-3 câu — song ngữ. |
| `flipLine` | Câu có **một từ tự đổi lặp lại** (hiển thị dưới thẻ tóm tắt, cột trái). `prefix` = phần đầu câu giữ nguyên, `words` = danh sách các từ luân phiên (mỗi từ `{en, vi}`), `suffix` = phần cuối (có thể để rỗng `""`). **Thêm/bớt từ chỉ cần sửa mảng `words`** — không đụng code. Đặt `"enabled": false` để ẩn cả câu. Mẹo: giữ các từ **dài gần bằng nhau** để câu không nhảy chiều rộng nhiều. |
| `experience` | Danh sách kinh nghiệm (hiển thị trong panel **tối**). Mỗi mục: `period` (mốc thời gian, ví dụ `"5/2025 – 07/2026"` — thường để chuỗi thường vì giống nhau 2 ngôn ngữ), `title` (vị trí, `{en, vi}`), `org` (nơi làm — giữ 1 bản). |
| `education` | Học vấn (hiển thị ngay dưới Kinh nghiệm, cùng panel tối). Mỗi mục: `school` (trường — giữ 1 bản), `degree` (bằng cấp, `{en, vi}`), `year` (năm — chuỗi), `gpa` (điểm — tuỳ chọn, bỏ đi cũng được). |
| `skills` | Danh sách kỹ năng → hiển thị dạng "viên thuốc". Tên tiếng Anh dùng chung thì để chuỗi thường; muốn dịch thì viết `{ "en": "...", "vi": "..." }`. |
| `tools` | Công cụ — viên thuốc có **logo** tự động. Tên khớp các thương hiệu sau sẽ hiện logo: Meta, Canva*, Google Analytics, Google Apps Script, Claude / Claude Code, ChatGPT*, Gemini, GitHub, Vercel. (*Canva & ChatGPT chưa có trong bộ icon → hiện chữ không kèm logo, không bị lỗi ảnh.) Tên lạ → chỉ hiện chữ. |
| `languages` | Ngôn ngữ. Mỗi mục: `name` + `level` (`{en, vi}`) và `value` = mức thành thạo **0–100** (điều khiển độ dài thanh bar). |

> 💡 Muốn thêm một kinh nghiệm / học vấn / kỹ năng / ngôn ngữ? Chỉ cần thêm một
> mục `{ ... }` vào đúng mảng (nhớ dấu phẩy ngăn cách). Muốn bớt thì xoá cả mục đó.

---

## 🧭 MENU TRÊN CÙNG (`nav`)

Object `nav` (nằm ngay sau `site`, đầu file) điều khiển **menu thả xuống ở thanh
điều hướng**: 3 mục **Projects / About / Contact** hiện ở giữa navbar; rê chuột
vào mỗi mục sẽ mở bảng kính (Projects hiện thumbnail + tên + mô tả từng dự án;
About/Contact hiện danh sách liên kết). Nội dung bên trong tự lấy từ
`projects`, `about` và `contact` — **không cần sửa ở đây**.

```json
"nav": [
  { "id": "projects", "label": { "en": "Projects", "vi": "Dự án" }, "enabled": true },
  { "id": "about",    "label": { "en": "About",    "vi": "Về tôi" }, "enabled": true },
  { "id": "contact",  "label": { "en": "Contact",  "vi": "Liên hệ" }, "enabled": true }
]
```

| Bạn muốn | Làm gì |
|---|---|
| **Đổi tên một mục menu** | Sửa `label` (`{ "en": "...", "vi": "..." }`) của mục đó. **Giữ nguyên `id`** (id điều khiển nội dung bên trong). |
| **Ẩn một mục menu** | Đổi `"enabled": true` → `"enabled": false` ở mục đó (mục biến mất khỏi cả navbar desktop lẫn menu hamburger mobile). |
| **Đổi thứ tự** | Đổi vị trí các khối `{ ... }` trong mảng `nav`. |

> ⚠️ `id` phải là một trong `projects` / `about` / `contact` thì mới có nội dung
> thả xuống tương ứng. Dự án bị `"enabled": false` sẽ **không** xuất hiện trong
> menu Projects.

---

## 🍳 CÔNG THỨC (recipes)

### A. Sửa chữ / số liệu
Tìm group theo Mục lục ở trên, rồi sửa trong `blocks[...].items`. Mọi chữ đều theo dạng
song ngữ `{ "en": "...", "vi": "..." }` (xem mục 🌐 SONG NGỮ).
- Block `"text"`: mỗi gạch đầu dòng là một cặp `{ "en": "...", "vi": "..." }`. In đậm bằng `<b>...</b>`.
- Block `"stats"`: mỗi số là `["giá trị", { "en": "nhãn", "vi": "nhãn" }]` — con số giữ nguyên.
- Block `"gallery"`: mỗi ảnh là `["/assets/ten-anh.jpg", { "en": "chú thích", "vi": "chú thích" }]`.

### B. Thêm một GROUP mới (tiểu mục mới trong 1 tab)
Vào `groups` của tab cần thêm, thêm một khối như sau (nhớ dấu phẩy ngăn cách):
```json
{
  "enabled": true,
  "title": { "en": "New sub-heading", "vi": "Tên tiểu mục mới" },
  "blocks": [
    { "type": "text", "items": [
      { "en": "Bullet content.", "vi": "Nội dung gạch đầu dòng." }
    ] }
  ]
}
```

### C. Thêm một TAB mới (section mới trong 1 dự án)
Vào `sections` của dự án, thêm một khối:
```json
{
  "enabled": true,
  "id": "ten-tab-khong-dau",
  "label": { "en": "Tab name", "vi": "Tên Tab hiển thị" },
  "groups": [
    {
      "enabled": true,
      "title": null,
      "blocks": [
        { "type": "text", "items": [
          { "en": "Tab content.", "vi": "Nội dung của tab." }
        ] }
      ]
    }
  ]
}
```

### D. Đổi thứ tự dự án
Chỉ cần **đổi vị trí khối `{ ... }` của dự án trong mảng `projects`** (cắt/dán lên trên
hoặc xuống dưới). Số thứ tự 01, 02… **tự đánh lại** theo vị trí mới — không cần sửa gì thêm.

### E. TẮT / BẬT một phần
Đổi `"enabled": true` ↔ `"enabled": false` ở đúng cấp (project / section / group).

---

## ✅ 3 VÍ DỤ CỤ THỂ

### Ví dụ 1 — Điền số liệu placeholder ở tab Overview của AI & Marketing Automation
Mở `projects[0].sections[0].groups[0].blocks[1].items` và đổi `[X]h → [Y]m` (chỉ đổi con
số, giữ nguyên phần nhãn `{en, vi}`):
```json
"items": [
  ["8h → 20m", { "en": "reporting time", "vi": "thời gian báo cáo" }],
  ["4", { "en": "tools shipped", "vi": "công cụ đã hoàn thành" }]
]
```

### Ví dụ 2 — TẮT dự án "Social Media" (ẩn khỏi toàn site)
Tại `projects[3]`, đổi cờ ở đầu dự án:
```json
{
  "enabled": false,
  "id": "social-media",
  ...
}
```
Kết quả: dự án biến mất khỏi trang chủ, link `/project/social-media` không còn, và các
dự án còn lại **tự đánh số lại** (K-Tech = 02, Copywriter = 03, University = 04).

### Ví dụ 3 — Thêm group "Podcast" vào tab TikTok Management
Vào `projects[3].sections[2].groups`, thêm vào cuối mảng (nhớ dấu phẩy trước khối mới):
```json
{
  "enabled": true,
  "title": { "en": "Podcast", "vi": "Podcast" },
  "blocks": [
    { "type": "text", "items": [
      { "en": "Short branded podcast scripts.", "vi": "Kịch bản podcast ngắn cho thương hiệu." }
    ] },
    { "type": "stats", "items": [
      ["120K", { "en": "listens", "vi": "lượt nghe" }]
    ] }
  ]
}
```

---

## 🖼️ Ảnh (thư mục /public/assets/)
Tất cả ảnh nằm trong `public/assets/`. Trong `content.json` đường dẫn luôn bắt đầu bằng
`/assets/...`. Upload ảnh mới: mở `public/assets/` trên github.com → **Add file → Upload
files** → **Commit changes**. Thay ảnh cũ mà không đổi tên: chỉ cần upload đè ảnh trùng
tên. Nên dùng ảnh ngang tỉ lệ **16:9**.

---

## Tóm tắt
| Bạn muốn | Làm gì |
|---|---|
| Sửa chữ 2 ngôn ngữ | Sửa cả `"en"` và `"vi"` (chỉ dùng Việt → chỉ sửa `"vi"`) |
| Sửa phần "Về tôi" | Sửa object `about` ở đầu file (xem mục 👤); thay ảnh: upload đè `avatar.png` |
| Sửa chữ / số liệu | Sửa `blocks[...].items` của group tương ứng (xem Mục lục) |
| Thêm tiểu mục | Thêm 1 `group` vào `groups` của tab (recipe B) |
| Thêm tab | Thêm 1 `section` vào `sections` của dự án (recipe C) |
| Đổi thứ tự dự án | Đổi vị trí trong mảng `projects` (recipe D) |
| Ẩn / hiện một phần | Đổi `"enabled"` true ↔ false (recipe E) |
| Thay ảnh | Upload vào `public/assets/` |

Mỗi lần **Commit changes** → **Vercel tự động deploy** → đợi 1–2 phút → xong. 🎉
