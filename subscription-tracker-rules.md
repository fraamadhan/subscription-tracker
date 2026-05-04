# 🛠️ Development Rules - Subscription Tracker

## 🧩 Tech Stack
- **Backend:** Laravel (Latest Stable)
- **Frontend:** React.js via Inertia.js
- **Styling:** Tailwind CSS
- **Language:** PHP & TypeScript (TSX)

---

## 🏗️ 1. Frontend Guidelines (React & Inertia)
- **Component-First & Atomic:** Buat komponen yang modular dan *reusable* di folder `resources/js/Components`. Pisahkan antara komponen kecil (Button, Input) dengan komponen layout atau fitur.
- **Inertia Workflow:** Manfaatkan `usePage` dan `Link` dari Inertia untuk navigasi dan pengelolaan state global yang dikirim dari Laravel.
- **Optimization:**
    - Gunakan *Dynamic Import* untuk halaman yang jarang diakses.
    - Manfaatkan Tailwind JIT untuk efisiensi CSS.
    - Gunakan format `.webp` untuk aset gambar dan terapkan *lazy loading*.
- **SEO & User-Centered:**
    - Gunakan komponen `<Head>` dari Inertia untuk manajemen Meta Tags di setiap halaman.
    - Pastikan desain *Mobile-First* dan aksesibel (Aria-labels, semantic HTML).

## ⚡ 2. Backend Guidelines (Laravel)
- **SOLID Principles:** Terapkan prinsip SOLID secara ketat. Satu class hanya boleh memiliki satu tanggung jawab.
- **Modular Logic:** - Gunakan **Controllers** hanya untuk mengatur alur data.
    - Pindahkan logika bisnis yang kompleks ke dalam **Services** atau **Actions**.
    - Gunakan **Form Requests** untuk validasi data.
- **Database & Security:**
    - Gunakan **Migrations** dan **Seeders** untuk struktur data.
    - Gunakan Eloquent ORM dan pastikan tidak ada query di dalam View/React component.
    - Pastikan semua input disanitasi dan dilindungi oleh CSRF (bawaan Laravel/Inertia).

## 📏 3. Coding Standards & Naming
- **Framework Standard:**
    - **PHP:** Ikuti standar PSR-12. Gunakan *PascalCase* untuk Class dan *camelCase* untuk method/variabel.
    - **React:** Gunakan *PascalCase* untuk file komponen (`SubscriptionCard.tsx`) dan *camelCase* untuk hooks atau helper.
    - **Tailwind:** Kelompokkan class Tailwind dengan urutan: Layout (Positioning), Box Model (Margin/Padding), Typography, Visuals (Colors/Borders), Misc.
- **File Structure:**
    - Controller: `app/Http/Controllers/`
    - Models: `app/Models/`
    - React Pages: `resources/js/Pages/`
    - Components: `resources/js/Components/`

## 📑 4. Subscription Tracker Specifics
- Buat logic yang akurat untuk kalkulasi *billing cycle* (Monthly/Yearly).
- Gunakan Database Indexing pada kolom yang sering dicari seperti `user_id` atau `renewal_date`.
- Implementasikan *Currency Formatting* yang konsisten di sisi frontend.