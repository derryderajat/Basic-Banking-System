const { PrismaClient, Prisma } = require(`@prisma/client`);
const Joi = require("joi");
const {
  ResponseTemplate,
  PaginationTemplate,
} = require("../helper/template.helper");

const prisma = new PrismaClient();
// POST /api/v1/accounts: menambahkan akun baru
// ke user yang sudah didaftarkan.
// GET /api/v1/accounts: menampilkan daftar akun.
// GET /api/v1/accounts: menampilkan detail akun.
const fetchAccounts = async (req, res) => {
  const { page } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = 5;
  const skip = (pageNumber - 1) * itemsPerPage;
  // Get users count
  try {
    const totalRecords = await prisma.bankAccounts.count();
    let accounts = await prisma.bankAccounts.findMany({
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
      },
      where: {
        deleted_at: null,
      },
      skip,
      take: itemsPerPage,
    });
    if (accounts.length === 0) {
      res
        .status(404)
        .json(
          ResponseTemplate(null, "Not Found", "Accounts is not found", false)
        );
      return;
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      const response = PaginationTemplate(
        accounts,
        totalRecords,
        pageNumber,
        totalPages,
        nextPage,
        prevPage
      );
      res.status(200).json(ResponseTemplate(response, "ok", null, true));
      return;
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
    return;
  }
};
const insertOneAccount = async (req, res) => {
  const { user_id, bank_name, bank_account_number } = req.body;

  try {
    const newBankAccount = await prisma.bankAccounts.create({
      data: {
        user_id, // Menambahkan user_id ke data
        bank_name,
        bank_account_number,
      },
    });

    const response = ResponseTemplate(newBankAccount, "Created", null, true);
    res.status(201).json(response);
    return;
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const responseError = ResponseTemplate(
        null,
        "Bad Request",
        "Data Already Exists",
        false
      );
      res.status(400).json(responseError);
      return;
    } else {
      res
        .status(500)
        .json(ResponseTemplate(null, "Internal Server Error", error, false));
      return;
    }
  }
};

const fetchAccountsById = async (req, res) => {
  const accountId = parseInt(req.params.accountId);
  try {
    const account = await prisma.bankAccounts.findUnique({
      where: {
        id: accountId,
        deleted_at: null,
      },
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        user: {
          select: {
            name: true,
            email: true,
            profile: {
              select: {
                identity_account_number: true,
                identity_type: true,
                address: true,
              },
            },
          },
        },
      },
    });
    if (account) {
      res.status(200).json(ResponseTemplate(account, "ok", null, true));
      return;
    }
    res
      .status(404)
      .json(ResponseTemplate(null, "Not Found", "Account is not found", false));
    return;
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
  }
};

const withdraw = async (req, res) => {
  const source_account_id = req.params.bank_account_number;
  const { amount } = req.body;
  const payload = {};

  payload.type = "Withdraw";
  payload.amount = amount;
  payload.source_account_id = source_account_id;
  payload.destination_account_id = null;

  try {
    const transaction = await prisma.transactions.create({
      data: payload,
    });
    const response = ResponseTemplate(transaction, "Created", null, true);
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error Controller Transaction", error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
    return;
  }
};
const deposit = async (req, res) => {
  const destination_account_id = req.params.bank_account_number;
  console.log(req.params);
  const { amount } = req.body;
  const payload = {};
  payload.type = "Deposit";
  payload.amount = amount;
  payload.source_account_id = null;
  payload.destination_account_id = destination_account_id;

  try {
    const transaction = await prisma.transactions.create({
      data: payload,
    });
    const response = ResponseTemplate(transaction, "Created", null, true);
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error Controller Transaction", error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
    return;
  }
};

const balanceInquiry = async (req, res) => {
  // Retrieve transactions for the specified bank account
  const bank_account_number = req.params.bank_account_number;

  const transactions = await prisma.transactions.findMany({
    where: {
      OR: [
        { source_account_id: bank_account_number },
        { destination_account_id: bank_account_number },
      ],
    },
  });
  // Calculate the balance
  let saldo = 0;
  for (const transaction of transactions) {
    if (transaction.type === "Deposit") {
      saldo += transaction.amount;
    } else if (transaction.type === "Withdraw") {
      saldo -= transaction.amount;
    } else if (
      transaction.type === "Transfer" &&
      transaction.source_account_id === bank_account_number
    ) {
      saldo -= transaction.amount;
    } else if (
      transaction.type === "Transfer" &&
      transaction.destination_account_id === bank_account_number
    ) {
      saldo += transaction.amount;
    }
  }

  return res
    .status(200)
    .json(ResponseTemplate({ bank_inquiry: saldo }, "ok", null, true));
};
module.exports = {
  deposit,
  withdraw,
  fetchAccounts,
  fetchAccountsById,
  insertOneAccount,
  balanceInquiry,
};
