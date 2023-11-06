const { PrismaClient, Prisma } = require(`@prisma/client`);
const roles = require("../helper/roles");
const { ResponseTemplate } = require("../helper/template.helper");

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
  const { role } = req.user;
  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // Check if role execpt admin it will not allowed to access this endpoint
  if (role.toLowerCase() !== roles.admin) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  try {
    // Get users count
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
      return res
        .status(404)
        .json(
          ResponseTemplate(null, "Not Found", "Accounts is not found", false)
        );
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      return res.status(200).json(
        ResponseTemplate(
          {
            accounts,
            totalRecords,
            pageNumber,
            totalPages,
            nextPage,
            prevPage,
          },
          "ok",
          null,
          true
        )
      );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
  }
};
const insertOneAccount = async (req, res) => {
  const { user_id, bank_name, bank_account_number } = req.body;
  const { role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // Check if role execpt admin it will not allowed to access this endpoint
  if (role.toLowerCase() !== roles.admin) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  try {
    const newBankAccount = await prisma.bankAccounts.create({
      data: {
        user_id, // Menambahkan user_id ke data
        bank_name,
        bank_account_number,
      },
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        user_id: true,
      },
    });

    const response = ResponseTemplate(newBankAccount, "Created", null, true);
    return res.status(201).json(response);
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
      return res.status(400).json(responseError);
    } else {
      return res
        .status(500)
        .json(ResponseTemplate(null, "Internal Server Error", error, false));
      return;
    }
  }
};

const fetchAccountsById = async (req, res) => {
  const accountId = parseInt(req.params.accountId);
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }

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
            id: true,
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
    // bank account is not found or not created yet
    if (!account) {
      return res
        .status(404)
        .json(
          ResponseTemplate(null, "Not Found", "Account is not found", false)
        );
    }
    // if role is customer only same id is allowed to see details
    if (id !== account.user.id && role.toLowerCase() === roles.customer) {
      return res
        .status(403)
        .json(
          ResponseTemplate(
            null,
            "Forbidden",
            "You are not allow in here",
            false
          )
        );
    }
    console.log(account.user.id);
    if (account) {
      res.status(200).json(ResponseTemplate(account, "ok", null, true));
      return;
    }
    return res
      .status(404)
      .json(ResponseTemplate(null, "Not Found", "Account is not found", false));
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
  }
};

const withdraw = async (req, res) => {
  const source_account_id = req.params.bank_account_number;
  const { amount } = req.body;
  const payload = {};
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  const data = await prisma.bankAccounts.findFirst({
    where: {
      bank_account_number: source_account_id,

      deleted_at: null,
    },
    select: {
      bank_account_number: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  // check if bank account owner is right owner
  if (id !== data.user.id && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }

  // if role is customer only same id is allowed to see details
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
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
    return;
  }
};
const deposit = async (req, res) => {
  const destination_account_id = req.params.bank_account_number;
  const { amount } = req.body;
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  const data = await prisma.bankAccounts.findFirst({
    where: {
      bank_account_number: destination_account_id,
      deleted_at: null,
    },
    select: {
      bank_account_number: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  // check if bank account owner is right owner
  if (id !== data.user.id && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }

  // if role is customer only same id is allowed to see details

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
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
    return;
  }
};

const balanceInquiry = async (req, res) => {
  // Retrieve transactions for the specified bank account
  const bank_account_number = req.params.bank_account_number;
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  const data = await prisma.bankAccounts.findFirst({
    where: {
      bank_account_number: bank_account_number,
      deleted_at: null,
    },
    select: {
      bank_account_number: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  // check if bank account owner is right owner
  if (id !== data.user.id && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // Calculate balance
  try {
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

    return res.status(200).json(
      ResponseTemplate(
        {
          bank_account_number: bank_account_number,
          bank_inquiry: saldo,
        },
        "ok",
        null,
        true
      )
    );
  } catch (error) {}
};

const history_transaction = async (req, res) => {
  // Retrieve transactions for the specified bank account
  const bank_account_number = req.params.bank_account_number;
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  const data = await prisma.bankAccounts.findFirst({
    where: {
      bank_account_number: bank_account_number,
      deleted_at: null,
    },
    select: {
      bank_account_number: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  // check if bank account owner is right owner
  if (id !== data.user.id && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 5;
  const skip = (pageNumber - 1) * itemsPerPage;

  try {
    const totalRecords = await prisma.transactions.count();
    const transactions = await prisma.transactions.findMany({
      where: {
        OR: [
          { source_account_id: bank_account_number },
          { destination_account_id: bank_account_number },
        ],
      },
    });

    if (transactions.length === 0) {
      res
        .status(404)
        .json(
          ResponseTemplate(null, "Not Found", "No transactions is shown", false)
        );
      return;
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      return res.status(200).json(
        ResponseTemplate(
          {
            transactions,
            totalRecords,
            pageNumber,
            totalPages,
            nextPage,
            prevPage,
          },
          "ok",
          null,
          true
        )
      );
    }
  } catch (error) {}
};

const transfer = async (req, res) => {
  const source_account_id = req.params.bank_account_number;
  const destination_account_id = req.params.destination_account_number;
  const { amount } = req.body;
  const payload = {};
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  const data = await prisma.bankAccounts.findFirst({
    where: {
      bank_account_number: source_account_id,

      deleted_at: null,
    },
    select: {
      bank_account_number: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  // check if bank account owner is right owner
  if (id !== data.user.id && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }

  // if role is customer only same id is allowed to see details
  payload.type = "Transfer";
  payload.amount = amount;
  payload.source_account_id = source_account_id;
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
module.exports = {
  deposit,
  withdraw,
  fetchAccounts,
  fetchAccountsById,
  insertOneAccount,
  balanceInquiry,
  history_transaction,
  transfer,
};
