-- DDL create tables
create table if not exists users(
	id serial primary key,
	name varchar(255) not null,
	email varchar(320) not null unique,
	password text not null,
	created_at timestamp not null default now(),
	updated_at timestamp default now(),
	deleted_at timestamp
);

create type identity_type as enum(
'ktp','sim');
create table if not exists profiles(
	id serial primary key,
	user_id int unique references users(id),
	identity_type identity_type not null,
	identity_account_number varchar(16) not null unique,
	address text not null,
	created_at timestamp not null default now(),
	updated_at timestamp default now(),
	deleted_at timestamp
);

create table if not exists bank_accounts(
	id serial primary key,
	user_id int references users(id),
	bank_name varchar(255),
	bank_account_number varchar(8) unique,
	created_at timestamp not null default now(),
	updated_at timestamp default now(),
	deleted_at timestamp

);
create table if not exists transactions(
	id serial primary key,
	source_account_id varchar(8)references bank_accounts(bank_account_number),
	destination_account_id varchar(8) references bank_accounts(bank_account_number),
	amount int not null,
	created_at timestamp not null default now()
);

create index trs on transactions (source_account_id, destination_account_id);


-- DML
insert into users(name, email, password)
values 
('derry derajat', 'derryd.derajat@gmail.com','123456'),
('andreas kumalasari', 'andre@gmail.com','123456'),
('poland ia', 'iapolan@gmail.com','123456'),
('merry curans', 'curansmerr@gmail.com','123456'),
('puh sepuh', 'masihpemula@gmail.com','123456');

insert into profiles(user_id, identity_type, identity_account_number, address)
values 
(1, 'ktp','3670251709970003', 'Cilegon banten'),
(2, 'ktp','3670252309970009', 'Serang banten'),
(3, 'sim','3670250409970008', 'Cilandak banten'),
(4, 'ktp','3670252209970007', 'Cikeusal banten'),
(5, 'sim','3670251109970006', 'Merak banten');

insert into bank_accounts ( user_id, bank_name, bank_account_number)
values
(1, 'bri','12332112'),
(2, 'bca','87123912'),
(3, 'bri','94812321'),
(4, 'bri','89712321'),
(5, 'bri','49122730');
insert into bank_accounts ( user_id, bank_name, bank_account_number)
values
(1, 'bsi','22738192');
insert into transactions (source_account_id, destination_account_id, amount)
values
('12332112','12332112',1000000),
('87123912','87123912',5000000),
('94812321','94812321',2500000),
('89712321','89712321',4000000),
('49122730','49122730',3200000),
('12332112','89712321',200000),
('89712321','12332112',100000),
('12332112','94812321',200000),
('94812321','12332112',50000),
('94812321','89712321',30000),
('89712321','94812321',10000),
('87123912','94812321',42000),
('94812321','87123912',20000),
('89712321','89712321',64000),
('94812321','49122730',200000),
('89712321','87123912',340000),
('87123912','49122730',120000),
('87123912','49122730',425000),
('89712321','12332112',20000),
('49122730','12332112',60000),
('49122730','87123912',40000);

