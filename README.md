# Project
### 💼 Overview

Your system will allow users to:
- Add income and expenses
- View current balance
- Display transaction history by category
- Save and load data from a file (bonus: persistence)

---

### 🧱 OOP Concepts Applied

| OOP Concept    | How It's Used                                                                 |
|----------------|------------------------------------------------------------------------------|
| Encapsulation  | Use private members and public getters/setters in classes like `Transaction` |
| Inheritance    | Create a base class `Transaction`, then derive `Income` and `Expense`        |
| Polymorphism   | Use virtual functions to process transactions differently                    |
| Abstraction    | Abstract details behind interfaces, such as how data is stored or displayed |

---


## 🔧 1. **Color Definitions (For Attractive Output)**

```cpp
#define GREEN   "\033[1;32m"
#define RED     "\033[1;31m"
#define CYAN    "\033[1;36m"
#define YELLOW  "\033[1;33m"
#define RESET   "\033[0m"
```

- These are ANSI escape codes used for coloring text in terminals.
- Makes output readable and engaging — for example, incomes are green, expenses are red.

---

## 🧩 2. **Base Class: `Transaction`**

```cpp
class Transaction {
protected:
    string date;
    double amount;
    string category;
public:
    Transaction(string d, double amt, string cat)
        : date(d), amount(amt), category(cat) {}
    virtual void display() const = 0; // pure virtual = abstract method
    virtual double getAmount() const { return amount; }
    virtual bool isIncome() const = 0;
    virtual ~Transaction() {}
};
```

### ✨ OOP Concepts:
- **Abstraction**: Users don’t need to know how transactions are stored.
- **Polymorphism**: `display()` and `isIncome()` are virtual — behavior changes in derived classes.

---

## ➕ 3. **Derived Classes: `Income` and `Expense`**

```cpp
class Income : public Transaction {
    ...
};

class Expense : public Transaction {
    ...
};
```

- These **inherit** from `Transaction` and override `display()` and `isIncome()`.

### ✨ OOP Concepts:
- **Inheritance**: Both are types of `Transaction`.
- **Polymorphism** again: They behave differently when `display()` is called.

Output examples:
```
[INCOME]  2025-07-01 | +$1500.00 | Salary
[EXPENSE] 2025-07-02 | -$300.00  | Groceries
```

---

## 📦 4. **`FinanceManager` Class**

```cpp
class FinanceManager {
private:
    vector<shared_ptr<Transaction>> records;
public:
    void addTransaction(...);
    void showAll() const;
    double getBalance() const;
};
```

- Stores all transactions using `shared_ptr` to handle polymorphism safely.
- Can:
  - Add income/expense
  - Show transaction history
  - Calculate total balance

### ✨ OOP Concepts:
- **Encapsulation**: All logic and data are grouped in this class.
- **Polymorphism**: Uses base class pointers to store various transaction types.

---

## 🧭 5. **Menu System & Main Function**

```cpp
void showMenu() { ... }

int main() {
    FinanceManager fm;
    ...
    do {
        showMenu();
        ...
    } while (choice != 5);
}
```

- Shows an interactive menu:
  1. Add Income
  2. Add Expense
  3. View Transactions
  4. View Balance
  5. Exit

Example output:
```
💰 Current Balance: $1080.00
👋 Exiting... Stay financially savvy!
```

---

## ✅ Summary of OOP Concepts Used

| Concept       | Where It's Applied |
|---------------|--------------------|
| Encapsulation | `FinanceManager` keeps all logic inside |
| Inheritance   | `Income` and `Expense` inherit `Transaction` |
| Polymorphism  | `display()` and `isIncome()` are used polymorphically |
| Abstraction   | UI hides internal complexities from the user |

---

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <iomanip>
using namespace std;

// ANSI color codes for better terminal output
#define GREEN   "\033[1;32m"
#define RED     "\033[1;31m"
#define CYAN    "\033[1;36m"
#define YELLOW  "\033[1;33m"
#define RESET   "\033[0m"

// Abstract base class
class Transaction {
protected:
    string date;
    double amount;
    string category;
public:
    Transaction(string d, double amt, string cat)
        : date(d), amount(amt), category(cat) {}
    virtual void display() const = 0;
    virtual double getAmount() const { return amount; }
    virtual bool isIncome() const = 0;
    virtual ~Transaction() {}
};

// Income class
class Income : public Transaction {
public:
    Income(string d, double amt, string cat)
        : Transaction(d, amt, cat) {}
    void display() const override {
        cout << GREEN << "[INCOME]  " << RESET
             << setw(10) << date << " | +$"
             << fixed << setprecision(2) << amount
             << " | " << category << endl;
    }
    bool isIncome() const override { return true; }
};

// Expense class
class Expense : public Transaction {
public:
    Expense(string d, double amt, string cat)
        : Transaction(d, amt, cat) {}
    void display() const override {
        cout << RED << "[EXPENSE] " << RESET
             << setw(10) << date << " | -$"
             << fixed << setprecision(2) << amount
             << " | " << category << endl;
    }
    bool isIncome() const override { return false; }
};

// Finance Manager
class FinanceManager {
private:
    vector<shared_ptr<Transaction>> records;
public:
    void addTransaction(shared_ptr<Transaction> t) {
        records.push_back(t);
        cout << YELLOW << "✔ Transaction added!" << RESET << endl;
    }

    void showAll() const {
        if (records.empty()) {
            cout << CYAN << "No transactions recorded yet." << RESET << endl;
            return;
        }
        cout << CYAN << "==== Transaction History ====" << RESET << endl;
        for (const auto& t : records)
            t->display();
    }

    double getBalance() const {
        double balance = 0;
        for (const auto& t : records)
            balance += (t->isIncome() ? t->getAmount() : -t->getAmount());
        return balance;
    }
};

// Function to display menu
void showMenu() {
    cout << CYAN << "\n====== Personal Finance Menu ======\n" << RESET;
    cout << "1. Add Income\n";
    cout << "2. Add Expense\n";
    cout << "3. View All Transactions\n";
    cout << "4. View Current Balance\n";
    cout << "5. Exit\n";
    cout << "Choose an option: ";
}

// Main program
int main() {
    FinanceManager fm;
    int choice;
    string date, category;
    double amount;

    do {
        showMenu();
        cin >> choice;

        switch (choice) {
        case 1:
            cout << "Enter date (YYYY-MM-DD): "; cin >> date;
            cout << "Enter amount: $"; cin >> amount;
            cout << "Enter category: "; cin >> ws; getline(cin, category);
            fm.addTransaction(make_shared<Income>(date, amount, category));
            break;
        case 2:
            cout << "Enter date (YYYY-MM-DD): "; cin >> date;
            cout << "Enter amount: $"; cin >> amount;
            cout << "Enter category: "; cin >> ws; getline(cin, category);
            fm.addTransaction(make_shared<Expense>(date, amount, category));
            break;
        case 3:
            fm.showAll();
            break;
        case 4:
            cout << GREEN << "💰 Current Balance: $" << fixed << setprecision(2)
                 << fm.getBalance() << RESET << endl;
            break;
        case 5:
            cout << YELLOW << "👋 Exiting... Stay financially savvy!" << RESET << endl;
            break;
        default:
            cout << RED << "Invalid option. Please try again." << RESET << endl;
        }

    } while (choice != 5);

    return 0;
}

```
