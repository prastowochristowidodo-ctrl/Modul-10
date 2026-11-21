# Praktikum Pemrograman Web - Node.js dan MySQL

## 1. Persiapan
1. Ekstrak folder proyek.
2. Jalankan XAMPP, lalu klik **Start** pada MySQL. Apache tidak wajib untuk program Node.js ini.
3. Buka folder proyek di VS Code.
4. Jalankan `npm install`.
5. Salin `.env.example` menjadi `.env`.
6. Sesuaikan isi `.env`. Untuk instalasi XAMPP standar, biasanya `DB_USER=root` dan `DB_PASSWORD=` (kosong). Jika MySQL Anda memakai password, isi sesuai password tersebut.

## 2. Jalankan migrasi
```bash
node migrate.js
```
Perintah ini membuat database `praktikum_db`, tabel `authors`, dan tabel `books` beserta kolom `stock` dan foreign key `ON DELETE CASCADE`.

**Perhatian:** `migrate.js` menghapus tabel lama sebelum membuat ulang. Data lama pada tabel tersebut akan hilang.

## 3. Jalankan program CRUD
```bash
node app.js
```
Program menambahkan penulis dan dua buku, menampilkan data dengan JOIN, memfilter tahun terbit, memperbarui judul buku, lalu menghapus penulis untuk memperlihatkan efek `ON DELETE CASCADE`.

## 4. Verifikasi melalui phpMyAdmin
Buka `http://localhost/phpmyadmin`, pilih database `praktikum_db`, lalu periksa tabel `authors` dan `books`. Karena program menguji DELETE di akhir, data contoh penulis dan bukunya akan terhapus. Jalankan `node app.js` lagi untuk mengulang pengujian (tanpa menjalankan migrasi lagi).

## 5. Query verifikasi
```sql
SELECT * FROM praktikum_db.authors;
SELECT * FROM praktikum_db.books;
```
