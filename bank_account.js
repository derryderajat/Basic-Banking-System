// BankAccount class represents a simple bank account with balance operations.
class BankAccount {
  // Constructor to initialize the account with an initial balance (default is 0).
  constructor(initialBalance = 0) {
    this.saldo = initialBalance;
  }

  // Method to add balance to the account.
  tambahSaldo() {
    const amt = this.prompt("Add Your Balance by");

    // Check if the user pressed "Cancel."
    if (amt == null) {
      console.log("No operation was performed");
    } else {
      this.saldo += amt;
      console.log(`Added balance of: ${amt}, current balance: ${this.saldo}`);
      alert(`Your current balance is ${this.saldo}`);
    }
  }

  // Method to withdraw balance from the account.
  kurangiSaldo() {
    const amt = this.prompt("Withdraw Your Balance by");

    // Check if the user pressed "Cancel."
    if (amt == null) {
      console.log("No operation was performed");
    } else if (this.saldo < amt) {
      alert(`Sorry, your balance is not sufficient`);
    } else {
      this.saldo -= amt;
      console.log(
        `Withdrawn balance of: ${amt}, current balance: ${this.saldo}`
      );
      alert(`Your current balance is ${this.saldo}`);
    }
  }

  // Prompt method to handle user input with error checking.
  prompt(title) {
    let amt;
    while (true) {
      amt = window.prompt(title);

      // Check if the user pressed "Cancel."
      if (amt === null) {
        alert("Operation canceled.");
        break; // Exit the loop
      } else if (amt === "") {
        alert("Input can't be blank");
      } else if (Number(amt) == 0) {
        alert("Input can't be zero (0)");
      } else if (Number(amt) < 0) {
        alert("Input can't be under 0");
      } else if (isNaN(Number(amt))) {
        alert("Only numeric input is allowed");
      } else {
        amt = Number(amt);
        break;
      }

      // Handle any other unexpected input.
      if (amt === undefined) {
        alert("Invalid input. Please try again.");
        continue;
      }
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
alert(`Your balance are ${bankAccount.getSaldo()}`);
console.log(`Your balance are ${bankAccount.getSaldo()}`);

openPopup();

// Event listener for the "Tambah Saldo" button click
tambahSaldoButton.addEventListener("click", () => {
  // Call the tambahSaldo method of the bankAccount object to add balance
  bankAccount.tambahSaldo();
  // Open the popup to show the updated balance
  openPopup();
});

// Event listener for the "Kurangi Saldo" button click
kurangiSaldoButton.addEventListener("click", () => {
  // Call the kurangiSaldo method of the bankAccount object to withdraw balance
  bankAccount.kurangiSaldo();
  // Open the popup to show the updated balance or handle other actions
  openPopup();
});
