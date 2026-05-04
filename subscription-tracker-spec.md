# Spesifikasi Proyek: Subscription Tracker

Dokumen ini berisi daftar fitur dan rancangan skema database untuk aplikasi **Subscription Tracker** yang dibangun menggunakan **Laravel, React, Inertia, dan Docker**.

---

## 1. Daftar Fitur Aplikasi

### A. Autentikasi & Keamanan
* **Registrasi Pengguna:** Pendaftaran akun baru.
* **Login & Logout:** Autentikasi sesi pengguna.
* **Verifikasi Akun (2 Cara):** Proses verifikasi menggunakan kode OTP yang dikirim melalui Email atau WhatsApp.
* **Lupa Password:** Fitur pemulihan akun menggunakan kode OTP yang dikirim melalui Email atau WhatsApp.

### B. Fitur Utama (Core)
* **Manajemen Langganan (CRUD):** Tambah, edit, hapus, dan lihat daftar layanan (Netflix, Spotify, dll).
* **Dashboard Finansial:** Visualisasi total pengeluaran per bulan/tahun dan tren biaya.
* **Kategorisasi:** Pengelompokan berdasarkan jenis layanan (Hiburan, Work, Utilities).

### C. Fitur Lanjutan (Advanced)
* **Sistem Pengingat (Reminders):** Notifikasi otomatis H-3/H-1 sebelum tanggal jatuh tempo.
* **Riwayat Tagihan (Billing History):** Log setiap pembayaran yang sudah dilakukan.
* **Manajemen Metode Pembayaran:** Melacak kartu atau e-wallet mana yang digunakan untuk tiap langganan.
* **Dukungan Multi-Mata Uang:** Konversi otomatis ke IDR untuk langganan dalam valuta asing.

---

## 2. Skema Database (PostgreSQL)

Berikut adalah struktur tabel yang optimal untuk mendukung fitur di atas:

### Tabel: `users`
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key |
| `name` | String | Nama lengkap |
| `email` | String (Unique, Nullable) | Alamat email unik |
| `phone_number` | String (Unique, Nullable)| Nomor WhatsApp unik |
| `email_verified_at` | Timestamp | Waktu verifikasi email |
| `phone_verified_at` | Timestamp | Waktu verifikasi WhatsApp |
| `password` | String | Hash password |
| `remember_token` | String | Token untuk fitur 'Remember Me' |
| `timestamps` | - | `created_at` & `updated_at` |

### Tabel: `otp_codes`
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key |
| `identifier` | String | Email atau Nomor WhatsApp target |
| `otp` | String | Kode OTP (biasanya 4-6 digit angka) |
| `purpose` | String | Tujuan OTP (e.g., 'verification', 'password_reset') |
| `expires_at` | Timestamp | Waktu kedaluwarsa OTP |
| `created_at` | Timestamp | Waktu pembuatan OTP |

### Tabel: `categories`
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key |
| `user_id` | BigInt (FK) | Relasi ke `users.id` |
| `name` | String | Nama kategori (e.g., 'Streaming') |
| `color_hex` | String | Kode warna untuk UI |

### Tabel: `payment_methods`
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key |
| `user_id` | BigInt (FK) | Relasi ke `users.id` |
| `name` | String | Nama bank/e-wallet (e.g., 'BCA', 'Gopay') |

### Tabel: `subscriptions`
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key |
| `user_id` | BigInt (FK) | Relasi ke `users.id` |
| `category_id` | BigInt (FK) | Relasi ke `categories.id` (Nullable) |
| `payment_method_id` | BigInt (FK) | Relasi ke `payment_methods.id` (Nullable) |
| `name` | String | Nama layanan |
| `price` | Decimal(15,2) | Harga langganan |
| `currency` | String(3) | Kode mata uang (Default: 'IDR') |
| `billing_cycle` | Enum | 'daily', 'weekly', 'monthly', 'yearly' |
| `next_billing_date` | Date | Tanggal tagihan berikutnya (Indexed) |
| `is_active` | Boolean | Status aktif langganan |

### Tabel: `billing_histories`
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key |
| `subscription_id` | BigInt (FK) | Relasi ke `subscriptions.id` |
| `amount_paid` | Decimal(15,2) | Jumlah yang dibayar |
| `payment_date` | Date | Tanggal pembayaran dilakukan |
| `status` | String | e.g., 'success', 'failed' |

---

## 3. Catatan Implementasi Teknis

1.  **Authentication:** Gunakan paket `laravel/breeze` dengan opsi React/Inertia. Ini sudah mencakup fitur login, register, email verification, dan forgot password secara out-of-the-box.
2.  **Indexing:** Tambahkan index pada kolom `subscriptions.next_billing_date` untuk mempercepat proses pengecekan scheduler setiap hari.
3.  **Task Scheduling:** Gunakan `php artisan schedule:run` untuk menjalankan logic pengecekan tanggal jatuh tempo dan pengiriman email reminder.
