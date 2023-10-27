const getBalance = (data, bank_number) => {
  const filteredData = data.filter((obj) => {
    return (
      obj.source_account_id == bank_number ||
      obj.destination_account_id == bank_number
    );
  });
  const fixAmount = filteredData.map((transaction) => {
    if (
      transaction.type == "Transfer" &&
      transaction.source_account_id == bank_number
    ) {
      transaction.amount = -transaction.amount;
    } else if (
      transaction.type == "Withdraw" &&
      transaction.source_account_id == bank_number
    ) {
      transaction.amount = -transaction.amount;
    }
    return transaction;
  });
  const totalAmount = fixAmount.reduce((accumulator, transaction) => {
    if (transaction.type === "Withdraw") {
      // If the transaction type is 'Withdraw', subtract the amount
      return accumulator - transaction.amount;
    } else {
      // For other transaction types, add the amount
      return accumulator + transaction.amount;
    }
  }, 0);

  console.log(totalAmount);
  return totalAmount;
};

module.exports = getBalance;
