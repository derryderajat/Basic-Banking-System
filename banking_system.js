// BankAccount class represents a simple bank account with balance operations.
class BankAccount {
  // Constructor to initialize the account with an initial balance (default is 0).
  #saldo;
  constructor(initialBalance = 0) {
    this.#saldo = initialBalance;
  }

  // Method to add balance to the account.
  // Method to add balance to the account.
  async deposit(amt) {
    try {
      // Check if user pressed "Cancel"
      if (amt == null) {
        console.log("Canceled");
        throw new Error("Process has been canceled");
      } else if (!isNaN(Number(amt)) && Number(amt) > 0) {
        console.log(`Adding balance of: ${amt}...`);
        await new Promise((resolve) => {
          setTimeout(() => {
            this.#saldo += Number(amt);
            document.getElementById("saldo").innerHTML = this.#saldo;
            alert(`Deposit success : ${this.#saldo}`);
            resolve(); // Resolve the promise after 2 seconds
          }, 2000);
        });
      }

      console.log(`deposit operation: ${amt}`);
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
      } else if (
        !isNaN(Number(amt)) &&
        Number(amt) > 0 &&
        Number(amt) <= this.#saldo
      ) {
        // Simulate an asynchronous process with a setTimeout.
        await new Promise((resolve) => {
          setTimeout(() => {
            this.#saldo -= Number(amt);
            document.getElementById("saldo").innerHTML = this.#saldo;
            console.log(
              `Withdrawn balance of: ${amt}, current balance: ${this.#saldo}`
            );
            alert(`Withdraw success: ${amt}\nYour balance is ${this.#saldo}`);
            resolve();
          }, 2000); // Simulate a 2-second delay
        });
      } else if (Number(amt) <= 0) {
        console.log("Invalid input. Please try again.");
        throw new Error("Invalid input");
      } else {
        alert("Sorry, your balance is not sufficient");
        throw new Error("Insufficient balance");
      }
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
    return this.#saldo;
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
