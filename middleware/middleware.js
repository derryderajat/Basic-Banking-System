const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const Joi = require("joi");
// function PrintSuccess(req, res, next) {
const notFound = (req, res, next) => {
  res.status(404).json(ResponseTemplate(null, "Not Found", null, 404));
};
const validateUserPost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    identity_type: Joi.string().max(10).required(),
    identity_account_number: Joi.string().max(20).required(),
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
  const { source_account_id, destination_account_id, type } = req.body;
  let existingSourceAccount;
  let existingDestinationAccount;
  if (type === "Withdraw") {
    existingSourceAccount = await prisma.bankAccounts.findUnique({
      where: {
        bank_account_number: source_account_id,
        deleted_at: null,
      },
    });

    if (!existingSourceAccount) {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "Source Account Can't Be Empty",
            400
          )
        );
    }
  } else if (type === "Deposit") {
    existingDestinationAccount = await prisma.bankAccounts.findUnique({
      where: {
        bank_account_number: destination_account_id,
        deleted_at: null,
      },
    });
    if (!existingDestinationAccount) {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "Destination Account Can't Be Empty",
            400
          )
        );
    }
  } else if (type === "Transfer") {
    existingDestinationAccount = await prisma.bankAccounts.findUnique({
      where: {
        bank_account_number: destination_account_id,
        deleted_at: null,
      },
    });
    existingSourceAccount = await prisma.bankAccounts.findUnique({
      where: {
        bank_account_number: source_account_id,
        deleted_at: null,
      },
    });
    if (!existingSourceAccount) {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "Source Account Can't Be Empty",
            400
          )
        );
    }
    if (!existingDestinationAccount) {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "Destination Account Can't Be Empty",
            400
          )
        );
    }
  }

  next(); // Continue to the next middleware
};
module.exports = {
  validateUserPost,
  notFound,
  isAmountPositive,
  validateBankAccount,
};