# Basic Bank System

Proyek ini adalah contoh sistem perbankan dasar yang dikembangkan untuk memahami konsep dasar perbankan dan transaksi keuangan.

## Fitur

Proyek ini mencakup beberapa fitur dasar:

- Membuat akun bank.
- Melakukan setoran dan penarikan dana.
- Transfer dana antar akun bank.
- Melihat saldo akun.
- Riwayat transaksi.

## Teknologi

Proyek ini dibangun menggunakan nodeJs dan menggunakan postgre untuk menyimpan informasi akun dan transaksi.

## Penggunaan

Anda dapat mengikuti langkah-langkah berikut untuk menjalankan proyek ini:

1. Clone repositori ini ke komputer Anda.
2. Pastikan Anda telah menginstal prasyarat yang diperlukan. dengan perintah **```npm install```**
3. Buat file **```.env```** dengan format seperti yang dicontohkan pada **```.env.example```**
3. Jalankan **```npm start```** untuk menjalankan aplikasi.
4. Aplikasi akan berjalan secara default pada ***```localhost:3000```***

## Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda ingin berkontribusi ke proyek ini, silakan buat cabang (branch) baru, lakukan perubahan yang Anda inginkan, dan buat pull request untuk menggabungkannya.




## ERD
 ![ERD ver.0 basic bank system](/bank_sys.png)

 ### Relations

- Setiap User dapat memiliki banyak Akun (One-to-Many antara Users dan Bank Accounts).
- Setiap Akun hanya dimiliki oleh satu User (Many-to-One antara Bank Accounts dan Users).
- Setiap User hanya memiliki satu Profile (One-to-One antara Users dan Profiles)
- Setiap Profile hanya dimiliki oleh satu User (One-to-One antara Profiles dan
Users)
- Setiap Akun dapat memiliki banyak Transaksi (Many-to-Many antara Bank Accounts dan Bank Accounts melalui table penampung Transactions).

### Documentation

Dokumentasi tersedia dalam swagger dan postman:
- Swagger:
    Berada pada path: **```/docs```**
- Postman:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/18134196-d8fa943f-a0d9-4d61-9d27-bd3a1f62ca7a?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D18134196-d8fa943f-a0d9-4d61-9d27-bd3a1f62ca7a%26entityType%3Dcollection%26workspaceId%3D14184828-f556-4133-bd84-a3cadf58bca4)

Terima kasih sudah menggunakan proyek Basic Bank System ini!