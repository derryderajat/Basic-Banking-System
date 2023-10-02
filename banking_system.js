// BankAccount class represents a simple bank account with balance operations.
class BankAccount {
  // Constructor to initialize the account with an initial balance (default is 0).
  constructor(initialBalance = 0) {
    this.saldo = initialBalance;
  }

  // Method to add balance to the account.
  async deposit(amt) {
    try {
      // check if user pressed "Cancel"
      if (amt == null) {
        console.log("Canceled");
        throw new Error("Process has been canceled");
      }
      console.log(`Adding balance of: ${amt}...`);

      // simulate asynchronous
      const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
          amt = Number(amt);
          if (!isNaN(amt) && amt > 0) {
            this.saldo += amt;
            document.getElementById("saldo").innerHTML = this.saldo;
            resolve("success");
          } else {
            reject(new Error("Invalid input"));
          }
        }, 2000);
      });
      console.log(`deposit operation: ${result}`);
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
      throw error;
    }
  }

  // Method to withdraw balance from the account.
  async withdraw(amt) {
    try {
      // Check if the user pressed "Cancel."
      if (amt == null) {
        console.log("No operation was performed");
        throw new Error("No operation was performed");
      }

      console.log(`Withdrawing balance of: ${amt}...`);

      // Simulate an asynchronous process with a setTimeout.
      const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!isNaN(amt) && amt > 0 && amt <= this.saldo) {
            this.saldo -= amt;
            document.getElementById("saldo").innerHTML = this.saldo;
            console.log(
              `Withdrawn balance of: ${amt}, current balance: ${this.saldo}`
            );
            alert(`Your current balance is ${this.saldo}`);
            resolve("Success");
          } else if (amt <= 0) {
            console.log("Invalid input. Please try again.");
            reject(new Error("Invalid input"));
          } else {
            alert("Sorry, your balance is not sufficient");
            reject(new Error("Insufficient balance"));
          }
        }, 2000); // Simulate a 2-second delay
      });

      console.log(`Withdrawal operation: ${result}`);
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  // Prompt method to handle user input with error checking.
  prompt(title) {
    let amt = window.prompt(title);

    // Check if the user pressed "Cancel."
    if (amt === null) {
      alert("Operation canceled.");
      throw new Error("Operation canceled.");
    }

    amt = Number(amt);

    if (isNaN(amt) || amt <= 0) {
      alert("Invalid input. Please try again.");
      console.error("Invalid input. Please try again.");
      throw new Error("Invalid input. Please try again.");
    }

    return amt;
  }

  // Method to get the current balance.
  getSaldo() {
    return this.saldo;
  }
}
// make an object called bankAccount
const bankAccount = new BankAccount();
const saldo = document.getElementById("saldo");
const popup = document.getElementById("popup");
const tambahSaldoButton = document.getElementById("tambahSaldo");
const kurangiSaldoButton = document.getElementById("kurangiSaldo");
// Function to display a popup element by setting its display property to "block".
function openPopup() {
  popup.style.display = "block";
}

// Function to hide a popup element by setting its display property to "none".
function closePopup() {
  popup.style.display = "none";
}

// Display balance
saldo.innerHTML = bankAccount.getSaldo();
openPopup();

// Event listener for the "Tambah Saldo" button click
tambahSaldoButton.addEventListener("click", () => {
  // Call the tambahSaldo method of the bankAccount object to add balance
  bankAccount.deposit(bankAccount.prompt("Enter the deposit amount"));
  // Open the popup to show the updated balance
  openPopup();
});

// Event listener for the "Kurangi Saldo" button click
kurangiSaldoButton.addEventListener("click", () => {
  // Call the kurangiSaldo method of the bankAccount object to withdraw balance
  bankAccount.withdraw(bankAccount.prompt("Enter the withdrawal amount:"));
  // Open the popup to show the updated balance or handle other actions
  openPopup();
});
