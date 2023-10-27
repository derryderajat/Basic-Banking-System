
## Skill Metric
- Node.JS
- Package Management
- Express.JS
- ORM with Prisma



## Criteria
- [x] membuat API menggunakan Express JS (40)

- [x] melakukan CRUD kedalam database menggunakan Prisma (40)
- [x] menggunakan JSON (20)


## Flowchart
 ![Tux, the Linux mascot](/bank_sys.png)

 ### Relations

- Setiap User dapat memiliki banyak Akun (One-to-Many antara Users dan Bank Accounts).
- Setiap Akun hanya dimiliki oleh satu User (Many-to-One antara Bank Accounts dan Users).
- Setiap User hanya memiliki satu Profile (One-to-One antara Users dan Profiles)
- Setiap Profile hanya dimiliki oleh satu User (One-to-One antara Profiles dan
Users)
- Setiap Akun dapat memiliki banyak Transaksi (Many-to-Many antara Bank Accounts dan Bank Accounts melalui table penampung Transactions).

### Endpoint
#### users 
- POST /api/v1/users: menambahkan user baru
beserta dengan profilnya.
- GET /api/v1/users: menampilkan daftar users.
- GET /api/v1/users/:userId: menampilkan detail
informasi user (tampilkan juga profilnya).
#### accounts 
- POST /api/v1/accounts: menambahkan akun baru
ke user yang sudah didaftarkan.
- GET /api/v1/accounts: menampilkan daftar akun.
- GET /api/v1/accounts: menampilkan detail akun.
#### transactions 
- POST /api/v1/transactions: mengirimkan uang
dari 1 akun ke akun lain (tentukan request body
nya).
- GET /api/v1/transactions: menampilkan daftar
transaksi.
- GET /api/v1/transactions/:transaction:
menampilkan detail transaksi (tampilkan juga
pengirim dan penerimanya).