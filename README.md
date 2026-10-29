# EduClass — E-learning SMA/SMK

Starter project untuk prototipe website e-learning bertema Matematika Integral.

## Fitur yang sudah bisa dicoba
- Dashboard dan progres materi
- Materi Integral dengan contoh dasar
- Kuis pilihan ganda otomatis dinilai
- Pengumpulan tugas berbasis teks
- Riwayat nilai kuis dan status tugas
- Absensi demo
- Diskusi kelas demo
- Layout responsif untuk ponsel dan desktop

## Batasan versi awal
Versi ini menyimpan data menggunakan `localStorage` di browser yang sedang digunakan. Data **tidak** terkirim ke guru, tidak tersinkron ke perangkat lain, dan bukan penyimpanan yang aman untuk data sekolah. Login multi-pengguna dan sinkronisasi database belum dihubungkan. Jangan gunakan data pribadi siswa sungguhan pada versi demo.

## Struktur file
```text
educlass/
├── index.html       # Struktur halaman
├── styles.css       # Desain dan responsif
├── app.js           # Navigasi, kuis, tugas, nilai, absensi, diskusi
├── supabase.sql     # Skema database awal dan kebijakan RLS
└── README.md        # Panduan
```

## Menjalankan di komputer
1. Ekstrak ZIP.
2. Buka folder `educlass`.
3. Cara paling sederhana: buka `index.html` di browser.
4. Untuk server lokal, gunakan ekstensi VS Code **Live Server**, lalu klik **Go Live**.

## Publikasikan melalui GitHub Pages
1. Buat repository baru di GitHub bernama `educlass`.
2. Unggah `index.html`, `styles.css`, `app.js`, `supabase.sql`, dan `README.md` ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu **Save**.
6. Tunggu proses deployment. URL biasanya berbentuk `https://USERNAME.github.io/educlass/`.

## Menyiapkan database Supabase (tahap berikutnya)
1. Buat proyek di Supabase.
2. Buka **SQL Editor**, lalu jalankan isi `supabase.sql`.
3. Aktifkan metode login yang dibutuhkan di Authentication.
4. Buat akun uji siswa dan guru.
5. Atur role guru/admin melalui proses tepercaya di dashboard, bukan dari formulir publik.
6. Hubungkan frontend dengan Supabase JS client dan gunakan Project URL serta publishable/anon key.
7. Jangan pernah menaruh `service_role` key di frontend atau repository publik.
8. Uji kebijakan Row Level Security (RLS) dengan akun siswa dan guru terpisah sebelum memasukkan data sungguhan.

## Catatan keamanan
`supabase.sql` adalah fondasi awal, bukan audit keamanan produksi. Sebelum dipakai sekolah, perketat kebijakan role, validasi penilaian kuis di server, batasi file upload, dan uji bahwa siswa tidak bisa membaca atau mengubah data siswa lain. Untuk penilaian kuis yang aman, jangan mengirim jawaban benar kepada browser sebelum pengumpulan.
