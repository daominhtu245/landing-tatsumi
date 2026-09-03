# Deploy Guide — たつみ協同組合 Landing

Hướng dẫn deploy landing page Tatsumi Cooperative lên production.

---

## 1. Yêu cầu hệ thống

| Mục | Phiên bản tối thiểu |
|---|---|
| Node.js | 18.18 trở lên (khuyến nghị 20.x LTS) |
| npm | 9.x trở lên |
| Git | bất kỳ |

Kiểm tra nhanh:

```bash
node --version   # v20.x
npm  --version   # 9.x+
```

---

## 2. Chạy local (development)

```bash
npm install            # cài dependencies (~1 phút)
npm run dev            # mở http://localhost:3000 (auto redirect → /ja)
```

Đổi ngôn ngữ qua nút **JA / EN** ở header. Hot-reload đã bật cho mọi thay đổi trong `app/`, `components/`, `messages/`, `content/`.

---

## 3. Build cho production

```bash
npm run build          # generate 37 trang static (.next/)
npm run start          # chạy server production ở :3000
```

Build thành công sẽ in bảng route + size như sau (tham chiếu):

```
Route (app)                                    First Load JS
● /[locale]                                    115 kB
● /[locale]/news/[slug]                        99.8 kB
● /[locale]/contact                            128 kB
...
○ /robots.txt                                  -
○ /sitemap.xml                                 -
```

Tất cả page đều **SSG** (pre-rendered HTML) — host nào cũng deploy được, không cần Node server.

---

## 4. Deploy lên Vercel (khuyến nghị)

Vercel là nền tảng của team Next.js — tối ưu nhất, free cho project nhỏ.

### Cách 1: GitHub → Vercel (CI/CD tự động)

1. Push code lên GitHub (private repo OK):
   ```bash
   git init
   git add .
   git commit -m "initial landing page"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Truy cập <https://vercel.com/new>, đăng nhập bằng GitHub.
3. Chọn repository → **Import**.
4. Để mặc định mọi setting (Framework Preset: **Next.js**, Build Command: `npm run build`, Output: `.next`).
5. Bấm **Deploy** — 2-3 phút sẽ có URL dạng `tatsumi-coop.vercel.app`.

Mỗi `git push` lên `main` → auto deploy production. Push lên branch khác → preview URL riêng.

### Cách 2: Vercel CLI (nhanh, không cần GitHub)

```bash
npm i -g vercel
vercel login
vercel              # lần đầu: trả lời prompts → preview URL
vercel --prod       # deploy production
```

---

## 5. Deploy lên Netlify

1. Push code lên GitHub.
2. Vào <https://app.netlify.com/start>, kết nối Git.
3. Build command: `npm run build`
4. Publish directory: `.next` (Netlify sẽ tự dùng plugin `@netlify/plugin-nextjs`).
5. Deploy.

Lưu ý: Netlify không tối ưu cho Next.js bằng Vercel — middleware (next-intl routing) có thể chậm hơn vài chục ms.

---

## 6. Self-host (VPS / Docker)

### 6a. Chạy thẳng trên VPS với pm2

Trên Ubuntu/Debian VPS:

```bash
# 1. Cài Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone & build
git clone <repo-url> /var/www/tatsumi
cd /var/www/tatsumi
npm ci
npm run build

# 3. Chạy bằng pm2
sudo npm i -g pm2
pm2 start "npm run start" --name tatsumi
pm2 startup           # auto-start sau reboot
pm2 save
```

Đặt **Nginx** làm reverse proxy + SSL:

```nginx
# /etc/nginx/sites-available/tatsumi-coop
server {
  listen 80;
  server_name tatsumi-coop.jp www.tatsumi-coop.jp;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tatsumi-coop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL miễn phí với certbot
sudo certbot --nginx -d tatsumi-coop.jp -d www.tatsumi-coop.jp
```

### 6b. Docker

Tạo `Dockerfile` ở root project:

```dockerfile
FROM node:20-alpine AS base

# 1. Install deps
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build + run:

```bash
docker build -t tatsumi-coop .
docker run -p 3000:3000 --restart unless-stopped tatsumi-coop
```

---

## 7. Static export (host trên S3, Cloudflare Pages, GitHub Pages)

> ⚠️ **Không còn dùng được nguyên trạng.** Từ khi form liên hệ nối vào
> `app/api/contact/route.ts`, project có API route nên `output: 'export'` sẽ lỗi.
> Nếu bắt buộc phải host tĩnh: xoá `app/api/contact/`, đổi form sang dịch vụ
> ngoài (Formspree/Web3Forms) hoặc chuyển form thành `mailto:`. Khuyến nghị
> dùng Vercel (§4) để giữ được form gửi mail thật.

Vì toàn bộ trang đều SSG, có thể export ra HTML thuần để host trên **bất kỳ static host nào**.

Thêm vào `next.config.mjs`:

```js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // ...giữ phần cũ
};
```

Sau đó:

```bash
npm run build         # sinh thư mục `out/`
# upload toàn bộ thư mục `out/` lên S3 / Cloudflare Pages / GitHub Pages
```

**Lưu ý khi static export:**
- Middleware (`middleware.ts` của next-intl) **không hoạt động** — visitor truy cập `/` sẽ không tự redirect sang `/ja`. Cần tạo file `out/index.html` chứa `<meta http-equiv="refresh" content="0; url=/ja/">` hoặc cấu hình redirect ở CDN.
- API routes không chạy được (hiện project chưa có nên OK).

---

## 8. Custom domain

### Trên Vercel

1. Vào Project → **Settings → Domains**.
2. Thêm `tatsumi-coop.jp` và `www.tatsumi-coop.jp`.
3. Cập nhật DNS theo hướng dẫn Vercel hiển thị:
   - Apex (`tatsumi-coop.jp`): A record → `76.76.21.21`
   - Subdomain (`www`): CNAME → `cname.vercel-dns.com`
4. Đợi DNS propagate (vài phút – vài giờ). SSL tự động.

### Self-host

Đã cover ở mục **6a** (Nginx + certbot).

---

## 9. Environment variables

Site chạy được mà **không cần env var nào** — nhưng khi đó form liên hệ sẽ
không gửi được mail (trả 503 và hiển thị SĐT/email để liên hệ trực tiếp).

Để form gửi mail thật về `info@ta23.net`, tạo `.env.local` (đã `.gitignore`)
hoặc khai báo trong dashboard Vercel/Netlify:

| Biến | Bắt buộc | Mô tả |
|---|:---:|---|
| `SMTP_HOST` | ✅ | Máy chủ SMTP của `ta23.net` (VD `mail.ta23.net`) |
| `SMTP_PORT` | — | Mặc định `587`. Dùng `465` nếu SSL trực tiếp |
| `SMTP_USER` | ✅ | Thường là `info@ta23.net` |
| `SMTP_PASS` | ✅ | Mật khẩu hộp thư — **không commit vào git** |
| `SMTP_SECURE` | — | `true`/`false`. Bỏ trống → tự suy ra từ port (465 = true) |
| `CONTACT_TO` | — | Địa chỉ nhận. Mặc định `SITE.email` trong `lib/site-config.ts` |
| `CONTACT_FROM` | — | Địa chỉ gửi. Mặc định `SMTP_USER` |
| `NEXT_PUBLIC_GA_ID` | — | Khi gắn Google Analytics |

Ví dụ `.env.local`:

```bash
SMTP_HOST=mail.ta23.net
SMTP_PORT=587
SMTP_USER=info@ta23.net
SMTP_PASS=********
CONTACT_TO=info@ta23.net
```

> **Thông tin tổ chức (domain, TEL, địa chỉ, email) KHÔNG nằm trong env var** —
> tất cả khai báo tập trung tại `lib/site-config.ts`.

---

## 10. Checklist trước khi go-live

### Bắt buộc — tuân thủ hồ sơ 許可申請

```bash
bash scripts/check-compliance.sh    # phải PASS (0 ERROR) mới được deploy
```

- [ ] `scripts/check-compliance.sh` trả về PASS
- [ ] `lib/site-config.ts` → `LICENSE_STATUS` đúng với thực tế (`applying` cho tới khi có phép)
- [ ] Trang `/licensing` hiển thị đúng nguyên văn đoạn tuyên bố của khách hàng
- [ ] Không có trang nào công khai nội dung 3 tài liệu chỉ được đăng sau khi có phép

### Cấu hình

- [ ] `SITE.domain` trong `lib/site-config.ts` khớp domain thật đang trỏ
- [ ] Điền `ORG_PROFILE` (設立年月日 / 出資金 / 組合員数 / 代表理事 / 事業区域 / 営業時間) khi khách hàng cung cấp — chưa điền thì site hiển thị 「準備中」
- [ ] Khai báo biến SMTP (§9) rồi gửi thử form một lần từ production
- [ ] Thay logo placeholder ở `components/common/logo.tsx` bằng logo chính thức
- [ ] Khi có tài khoản SNS thật: điền `socialLinks` (footer) + `SOCIAL` (social-feed) rồi bật `FEATURES.socialLinks` / `FEATURES.socialFeed`

### Kỹ thuật

- [ ] `npm run build` không lỗi
- [ ] Kiểm tra 2 ngôn ngữ × toàn bộ trang, responsive 360px / 414px
- [ ] Submit sitemap lên Google Search Console: `https://ta23.net/sitemap.xml`
- [ ] Lighthouse: SEO ≥ 90, Accessibility ≥ 90

---

## 11. Contact form — cách hoạt động

Form đã nối vào API route thật: `app/api/contact/route.ts`.

```
components/forms/contact-form.tsx
   └─ POST /api/contact
        └─ nodemailer → SMTP (§9) → info@ta23.net
```

Hành vi theo từng tình huống:

| Tình huống | HTTP | Người dùng thấy |
|---|:---:|---|
| Gửi thành công | 200 | 「送信が完了しました」 |
| Chưa cấu hình SMTP | 503 | Thông báo lỗi **kèm SĐT và email** để liên hệ trực tiếp |
| SMTP lỗi khi gửi | 502 | như trên |
| Dữ liệu không hợp lệ | 400 | Lỗi ngay tại field |
| Quá 5 lần / 10 phút / IP | 429 | như trường hợp lỗi |
| Bot điền vào honeypot | 200 | im lặng bỏ qua, không gửi mail |

> **Nguyên tắc:** form **không bao giờ** báo「送信が完了しました」khi mail chưa thực sự
> được gửi. Bản trước chỉ `setTimeout(800)` rồi báo thành công — đã sửa.

Chống spam: honeypot (`website`) + rate limit trong bộ nhớ. Nếu bị spam nhiều,
cân nhắc thêm Cloudflare Turnstile hoặc hCaptcha.

---

## 12. Troubleshooting

| Vấn đề | Giải pháp |
|---|---|
| `npm install` chậm/lỗi network | Đổi mirror: `npm config set registry https://registry.npmmirror.com` |
| Build báo `out of memory` | Tăng heap: `NODE_OPTIONS=--max-old-space-size=4096 npm run build` |
| Vercel build thất bại với `next-intl` | Đảm bảo Node version ở Vercel ≥ 18.18 (Settings → General → Node.js Version) |
| Trang JP load chữ EN trước rồi đổi sang JP | Kiểm tra `unstable_setRequestLocale(locale)` ở đầu mỗi page server component |
| Hình ảnh Unsplash không load trên prod | Đã whitelist `images.unsplash.com` trong `next.config.mjs` — nếu đổi nguồn ảnh, nhớ thêm domain mới |

---

## 13. Bảo trì hàng tháng

- Cập nhật phụ thuộc bảo mật: `npm audit fix`
- Bump Next.js patch version: `npm install next@latest eslint-config-next@latest`
- Thêm bài blog mới: edit `content/posts.ts`, rồi `git push` — Vercel tự rebuild.
- Thêm trang mới: tạo file ở `app/[locale]/<new-route>/page.tsx`, nhớ gọi `unstable_setRequestLocale(locale)` ở dòng đầu.

---

**Khuyến nghị:** Dùng **Vercel + GitHub** cho lần đầu — setup trong 5 phút, free, auto SSL + CDN toàn cầu. Khi traffic vượt 100k req/tháng hoặc cần tính năng đặc biệt mới cân nhắc self-host.
