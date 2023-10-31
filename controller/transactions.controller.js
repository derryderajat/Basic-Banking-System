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
      return res
        .status(404)
        .json(
          ResponseTemplate(null, "Sorry data is not found", null, "Not Found")
        );
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
      return res
        .status(200)
        .json(ResponseTemplate(response, "success", null, "ok"));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        ResponseTemplate(
          null,
          "Something broke!",
          error.message,
          "Internal Server Error"
        )
      );
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
      return res
        .status(200)
        .json(ResponseTemplate(user, "success", null, "ok"));
    } else {
      return res
        .status(404)
        .json(
          ResponseTemplate(null, "Sorry data is not found", null, "Not Found")
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        ResponseTemplate(
          null,
          "Something broke!",
          error.message,
          "Internal Server Error"
        )
      );
  }
};
module.exports = {
  fetchTransactions,
  fetchTransactionById,
};
