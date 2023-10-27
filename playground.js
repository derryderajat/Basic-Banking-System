/**
 * Middleware to validate the bank account number.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Callback to proceed to the next middleware.
 */
const validateBankAccount = (req, res, next) => {
  const { source_account_id, destination_account_id, type } = req.body;

  if (type === "Withdraw" && !source_account_id) {
    return res
      .status(400)
      .json(
        ResponseTemplate(
          null,
          "Bad Request",
          "Invalid Bank Account Number",
          400
        )
      );
  } else if (type === "Deposit" && !destination_account_id) {
    return res
      .status(400)
      .json(
        ResponseTemplate(
          null,
          "Bad Request",
          "Invalid Bank Account Number",
          400
        )
      );
  } else if (
    type === "Transfer" &&
    (!source_account_id || !destination_account_id)
  ) {
    if (!source_account_id) {
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
    if (!destination_account_id) {
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

/**
 * Create a new transaction based on the provided request data.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const createTransaction = async (req, res) => {
  const { source_account_id, destination_account_id, amount, type } = req.body;

  // Define an asynchronous function to return a list of transactions
  const TransactionList = async () => {
    const transactionsList = await prisma.transactions.findMany({});
    // Check if user exists
    if (!transactionsList) {
      return res.json(ResponseTemplate(null, "User not found", null, 404));
    }
    return transactionsList;
  };

  const payload = {};
  const data_transaction = await TransactionList();

  // Check if the amount is greater or equal to the balance
  if (
    type === "Withdraw" &&
    amount >= getBalance(data_transaction, source_account_id)
  ) {
    return res
      .status(400)
      .json(
        ResponseTemplate(null, "Bad Request", "Balance is not enough", 400)
      );
  }

  // Construct the payload based on the transaction type
  switch (type) {
    case "Withdraw":
      payload.type = "Withdraw";
      payload.amount = amount;
      payload.source_account_id = source_account_id;
      payload.destination_account_id = null;
      break;

    case "Deposit":
      payload.type = "Deposit";
      payload.amount = amount;
      payload.source_account_id = null;
      payload.destination_account_id = destination_account_id;
      break;

    case "Transfer":
      payload.type = "Transfer";
      payload.amount = amount;
      payload.source_account_id = source_account_id;
      payload.destination_account_id = destination_account_id;
      break;

    default:
      return res
        .status(400)
        .json(ResponseTemplate(null, "Bad Request", null, 400));
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
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
  }
};

// Apply the validateBankAccount middleware before createTransaction
app.post("/create-transaction", validateBankAccount, createTransaction);
