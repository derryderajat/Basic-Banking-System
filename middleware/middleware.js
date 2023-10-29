const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const Joi = require("joi");



const notFound = (req, res, next) => {
  res.status(404).json(ResponseTemplate(null, "Not Found", null, 404));
};
const validateUserPost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    identity_type: Joi.string().max(10).required(),
    identity_account_number: Joi.string().alphanum().max(20).required(),
    address: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    let respErr = ResponseTemplate(
      null,
      "invalid request",
      error.details[0].message,
      400
    );
    res.status(400).json(respErr);
    return;
  }

  next();
};

const isAmountPositive = (req, res, next) => {
  const { amount } = req.body;
  if (amount <= 0) {
    res
      .status(400)
      .json(ResponseTemplate(null, "Bad Request", "Invalid Amount", 400));
    return;
  }
  next();
};
const validateBankAccount = async (req, res, next) => {
  const bank_account_number = req.params.bank_account_number;
  const is_bank_account_exists = await prisma.bankAccounts.findUnique({
    where: {
      bank_account_number: bank_account_number,
    },
  });
  if (!is_bank_account_exists) {
    res
      .status(404)
      .json(
        ResponseTemplate(null, "Bank Account Number Is Not Found", true, 404)
      );
    return;
  }

  next(); // Continue to the next middleware
};
const isBalanceSufficient = async (req, res, next) => {
  const source_account_id = req.params.bank_account_number;
  const { amount } = req.body;
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
  let balance_inquiry = 0;
  for (const transaction of transactions) {
    if (transaction.type === "Deposit") {
      balance_inquiry += transaction.amount;
    } else if (transaction.type === "Withdraw") {
      balance_inquiry -= transaction.amount;
    } else if (
      transaction.type === "Transfer" &&
      transaction.source_account_id === bank_account_number
    ) {
      balance_inquiry -= transaction.amount;
    } else if (
      transaction.type === "Transfer" &&
      transaction.destination_account_id === bank_account_number
    ) {
      balance_inquiry += transaction.amount;
    }
  }
  if (amount > balance_inquiry) {
    return res
      .status(400)
      .json(
        ResponseTemplate(null, "Bad Request", "Balance is not enough", 400)
      );
  }
  next();
};
module.exports = {
  validateUserPost,
  notFound,
  isAmountPositive,
  validateBankAccount,
  isBalanceSufficient,
};
