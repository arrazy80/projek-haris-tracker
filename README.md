
# Pelacak Berat Badan Ideal

Aplikasi web satu halaman sederhana untuk tugas kuliah. Tanpa database — data disimpan secara lokal di browser menggunakan LocalStorage.

Fitur
- Input tinggi (cm), berat (kg), usia, jenis kelamin
- Menghitung BMI dan menampilkan kategori BMI
- Menghitung rentang berat ideal (BMI 18.5–24.9) berdasarkan tinggi
- Menyimpan riwayat berat di LocalStorage dan menampilkan diagram garis sederhana
- Desain responsif dan minimal

Cara menjalankan
1. Buka `index.html` di browser modern (tanpa perlu server).

File
- `index.html` — antarmuka dan markup
- `styles.css` — styling responsif minimal
- `app.js` — logika, penanganan LocalStorage, dan rendering grafik

Catatan untuk tugas
- Rentang ideal dihitung menggunakan ambang BMI 18.5–24.9.
- Riwayat disimpan sebagai array di bawah kunci `ibwt_history_v1` pada LocalStorage.
- Implementasi dibuat minimal agar mudah dijelaskan.
