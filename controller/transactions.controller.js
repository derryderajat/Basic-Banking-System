const { PrismaClient, Prisma } = require(`@prisma/client`);
const {
  ResponseTemplate,
  PaginationTemplate,
} = require("../helper/template.helper");
const getBalance = require("../helper/getBalance.helper");
const prisma = new PrismaClient();

// Handlers
const createTransaction = async (req, res) => {
  /*
  The purpose of this handler is to create a transaction that requires data such as:

    - source_account_id: The source bank account number.
    - destination_account_id: The destination bank account number.
    - amount: The amount of money involved in the transaction.
    - type: The type of transaction (e.g., Withdraw, Deposit, or Transfer).

  The handler will check the balance of the bank account number specified to determine if the balance is sufficient for the transaction. If the transaction is a withdrawal or a transfer, it ensures that the balance is adequate for the requested amount. This process involves verifying the available balance before allowing the transaction to proceed.
*/

  const { source_account_id, destination_account_id, amount, type } = req.body;

  // Define an asynchronous function to return list of transactions
  const TransactionList = async () => {
    const transactionsList = await prisma.transactions.findMany({});
    // Check if user is exist
    if (!transactionsList) {
      return res.json(ResponseTemplate(null, "User not found", null, 404));
    }
    return transactionsList;
  };
  const payload = {};
  const data_transaction = await TransactionList();
  // Check if the amount is greater or equal to the balance
  if (
    (type === "Withdraw" || type === "Transfer") &&
    amount >= getBalance(data_transaction, source_account_id)
  ) {
    return res
      .status(400)
      .json(
        ResponseTemplate(null, "Bad Request", "Balance is not enough", 400)
      );
  }
  payload.type = type;
  payload.amount = amount;
  if (type === "Deposit") {
    payload.source_account_id = null;
    payload.destination_account_id = destination_account_id;
  } else if (type === "Withdraw") {
    payload.source_account_id = source_account_id;
    payload.destination_account_id = null;
  } else {
    payload.source_account_id = source_account_id;
    payload.destination_account_id = destination_account_id;
  }

  try {
    const transaction = await prisma.transactions.create({
      data: payload,
    });
    const response = ResponseTemplate(
      transaction,
      "Transaction Created",
      null,
      201
    );
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error Controller Transaction", error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
  }
};
const fetchTransactions = async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 5;
  const skip = (pageNumber - 1) * itemsPerPage;
  // Get users count
  try {
    const totalRecords = await prisma.transactions.count();
    let transaction = await prisma.transactions.findMany({
      where: {},
      skip,
      take: itemsPerPage,
    });
    if (transaction.length === 0) {
      res.status(404).json(ResponseTemplate(null, "Not Found", null, 404));
      return;
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      const response = PaginationTemplate(
        transaction,
        totalRecords,
        pageNumber,
        totalPages,
        nextPage,
        prevPage
      );
      res.status(200).json(ResponseTemplate(response, "ok", null, 200));
      return;
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
  }
};
const fetchTransactionById = async (req, res) => {
  const transactionId = parseInt(req.params.id);
  try {
    const user = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });

    if (user) {
      return res.status(200).json(ResponseTemplate(user, "ok", null, 200));
    } else {
      return res
        .status(404)
        .json(ResponseTemplate(null, "Not Found", null, 404));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
  }
};
module.exports = {
  createTransaction,
  fetchTransactions,
  fetchTransactionById,
};
