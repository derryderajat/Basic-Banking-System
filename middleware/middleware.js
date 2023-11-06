const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const Joi = require("joi");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const isAuthenticate = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json(
        ResponseTemplate(null, "Unauthorized", "you're not authorized", false)
      );
  }
  const token = authorization.slice(7);
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json(
          ResponseTemplate(
            null,
            "Unauthorized",
            "Token is invalid or expired",
            false
          )
        );
    }

    // Check if the token is not expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return res
        .status(401)
        .json(
          ResponseTemplate(null, "Unauthorized", "Token has expired", false)
        );
    }
    req.user = decoded;
    // console.log(decoded);
    next();
  });
};

const notFound = (req, res, next) => {
  return res
    .status(404)
    .json(ResponseTemplate(null, "Not Found", "you are lost?", false));

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
      "Bad Request",
      error.details[0].message,
      false
    );
    res.status(400).json(respErr);
    return;
  }

  next();
};

const isAmountPositive = (req, res, next) => {
  const { amount } = req.body;
  if (!Number(amount)) {
    return res
      .status(400)
      .json(
        ResponseTemplate(null, "Bad Request", "Amount should be numeric", false)
      );
  }
  if (Number(amount) <= 0) {
    return res
      .status(400)
      .json(ResponseTemplate(null, "Bad Request", "Invalid Amount", false));
  }
  next();
};
const validateBankAccount = async (req, res, next) => {
  const bank_account_number = req.params.bank_account_number;
  const destination_account_id = req.params.destination_account_number;

  const is_bank_account_exists = await prisma.bankAccounts.findUnique({
    where: {
      bank_account_number: bank_account_number,
    },
  });
  if (!is_bank_account_exists) {
    return res
      .status(404)
      .json(
        ResponseTemplate(null, "Bank Account Number Is Not Found", true, 404)
      );
    return;
  }
  next(); // Continue to the next middleware
};
const isBalanceSufficient = async (req, res, next) => {
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
  isAuthenticate,
};
