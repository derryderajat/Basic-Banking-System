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
      where: {
        deleted_at: null,
      },
      skip,
      take: itemsPerPage,
    });
    if (accounts.length === 0) {
      res.json(ResponseTemplate(null, "Not Found", null, 404));
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
      res.json(ResponseTemplate(response, "ok", null, 200));
      return;
    }
  } catch (error) {
    console.log(error);
    res.json(ResponseTemplate(null, "Internal Server Error", error, 500));
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

    const response = ResponseTemplate(newBankAccount, "Created", null, 201);
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
        "Bad request",
        "Duplicate data",
        400
      );
      res.status(400).json(responseError);
      return;
    } else {
      res
        .status(500)
        .json(ResponseTemplate(null, "Internal Server Error", error, 500));
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
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profiles: true,
          },
        },
      },
    });
    if (account) {
      res.json(ResponseTemplate(account, "ok", null, 200));
      return;
    }
    res.json(ResponseTemplate(null, "Not Found", null, 404));
    return;
  } catch (error) {
    res.json(ResponseTemplate(null, "Internal Server Error", null, 500));
    return;
  }
};
module.exports = {
  fetchAccounts,
  fetchAccountsById,
  insertOneAccount,
};
