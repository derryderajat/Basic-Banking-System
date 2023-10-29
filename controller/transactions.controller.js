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
  fetchTransactions,
  fetchTransactionById,
};
