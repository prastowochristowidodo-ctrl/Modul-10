const pool = require('./db');

async function main() {
    try {
      // Menghapus data percobaan sebelumnya jika sudah ada
        await pool.execute(
           'DELETE FROM authors WHERE email = ?',
          ['tereliye@example.com']
);

        // --- 1. INSERT DATA MENGGUNAKAN PARAMETERIZED QUERY ---
        console.log('\n--- Menambahkan Data Penulis ---');
        const insertAuthorSql = 'INSERT INTO authors (name, email) VALUES (?, ?)';
        const [authorResult] = await pool.execute(insertAuthorSql, ['Tere Liye', 'tereliye@example.com']);
        const authorId = authorResult.insertId;
        console.log(`✅ Penulis berhasil ditambahkan dengan ID: ${authorId}`);

        console.log('\n--- Menambahkan Data Buku ---');
        const insertBookSql = 'INSERT INTO books (title, author_id, published_year) VALUES (?, ?, ?)';
        await pool.execute(insertBookSql, ['Bumi', authorId, 2014]);
        await pool.execute(insertBookSql, ['Bulan', authorId, 2015]);
        console.log(`✅ Buku-buku berhasil ditambahkan.`);

        // --- 2. SELECT DATA (READ DENGAN JOIN) ---
        console.log('\n--- Menampilkan Semua Data Buku dan Penulisnya ---');
        const selectSql = `
            SELECT books.id, books.title, books.published_year, authors.name AS author_name 
            FROM books 
            JOIN authors ON books.author_id = authors.id
        `;
        const [books] = await pool.execute(selectSql);
        console.table(books);

        // --- 3. AMBIL DATA DENGAN FILTER AMAN ---
        console.log('\n--- Mencari Buku Berdasarkan Tahun Terbit ---');
        const searchYear = 2014;
        const searchSql = 'SELECT * FROM books WHERE published_year = ?';
        const [filteredBooks] = await pool.execute(searchSql, [searchYear]);
        console.log(`Buku yang terbit tahun ${searchYear}:`, filteredBooks);
    
       // --- 4. UPDATE JUDUL BUKU ---
        console.log('\n--- Mengubah Judul Buku ---');

        const updateSql = 'UPDATE books SET title = ? WHERE id = ?';

        const [updateResult] = await pool.execute(
        updateSql,
         ['Bumi Edisi Revisi', filteredBooks[0].id]
        );

        console.log('Jumlah buku diperbarui:', updateResult.affectedRows);


        // --- 5. DELETE DATA PENULIS ---
console.log('\n--- Menghapus Data Penulis ---');

const deleteSql = 'DELETE FROM authors WHERE id = ?';

const [deleteResult] = await pool.execute(deleteSql, [authorId]);

console.log('Jumlah penulis dihapus:', deleteResult.affectedRows);

// --- 6. CEK ON DELETE CASCADE ---
const [remainingBooks] = await pool.execute(
    'SELECT * FROM books WHERE author_id = ?',
    [authorId]
);

console.log('Sisa buku milik penulis:', remainingBooks);

      } catch (error) {
        console.error('❌ Terjadi kesalahan operasi database:', error);
    } finally {
        await pool.end();
        console.log('\n🔒 Koneksi database ditutup dengan aman.');
    }
}

main();
