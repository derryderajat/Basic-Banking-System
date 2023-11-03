const { PrismaClient, Prisma } = require(`@prisma/client`);
const {
  ResponseTemplate,
  PaginationTemplate,
} = require("../helper/template.helper");
const prisma = new PrismaClient();

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

      const response = PaginationTemplate(
        transaction,
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
const fetchTransactionById = async (req, res) => {
  const transactionId = parseInt(req.params.id);
  try {
    const user = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
      },
      select: {
        amount: true,
        created_at: true,
        type: true,
        sourceAccount: {
          select: {
            bank_name: true,
            bank_account_number: true,
          },
        },
        destinationAccount: {
          select: {
            bank_name: true,
            bank_account_number: true,
          },
        },
      },
    });

    if (user) {
      return res.status(200).json(ResponseTemplate(user, "ok", null, true));
    } else {
      return res
        .status(404)
        .json(ResponseTemplate(null, "Not Found", "User is not found", false));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
    return;
  }
};
module.exports = {
  fetchTransactions,
  fetchTransactionById,
};
