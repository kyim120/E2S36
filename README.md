
## 🚀 Final Project Personal Finance Tracker in C++

This program helps users:
- 💰 Record incomes and expenses
- 📊 View all transactions
- 📈 Check their current balance

You’ll understand and apply core **OOP principles** like **abstraction**, **inheritance**, **polymorphism**, and **encapsulation**.

---

## 🧠 Key Concepts (Explained Simply)

| OOP Concept    | What It Means Simply                          | Where It's Used                                                       |
|----------------|-----------------------------------------------|-----------------------------------------------------------------------|
| **Encapsulation**  | Hiding data and giving access through functions | `FinanceManager` keeps its data private, only accessed via methods     |
| **Inheritance**    | One class builds on another                 | `Income` and `Expense` both “inherit” from `Transaction`              |
| **Polymorphism**   | One command behaves differently for each class | The `display()` method acts differently for incomes/expenses          |
| **Abstraction**    | Showing only important info, hiding how it works | Users don’t see how data is stored, only interact with a simple menu  |

---

## 💻 Code Summary

Here’s a clean version of the code with clear logic and simpler output. This version avoids tricky libraries like `<iomanip>`, so it's viva-ready:

```cpp
#include <iostream>
#include <vector>
#include <memory>
using namespace std;

// Abstract base class
class Transaction {
protected:
    string date;
    double amount;
    string category;
public:
    Transaction(string d, double a, string c) : date(d), amount(a), category(c) {}
    virtual void display() const = 0; // Pure virtual function
    virtual double getAmount() const { return amount; }
    virtual bool isIncome() const = 0;
    virtual ~Transaction() {}
};

// Derived class for income
class Income : public Transaction {
public:
    Income(string d, double a, string c) : Transaction(d, a, c) {}
    void display() const override {
        cout << "[INCOME]  " << date << " | +" << amount << " | " << category << endl;
    }
    bool isIncome() const override { return true; }
};

// Derived class for expense
class Expense : public Transaction {
public:
    Expense(string d, double a, string c) : Transaction(d, a, c) {}
    void display() const override {
        cout << "[EXPENSE] " << date << " | -" << amount << " | " << category << endl;
    }
    bool isIncome() const override { return false; }
};

// Finance Manager to handle records
class FinanceManager {
private:
    vector<shared_ptr<Transaction>> records;  // Holds both income & expenses
public:
    void addTransaction(shared_ptr<Transaction> t) {
        records.push_back(t);
        cout << "Transaction added successfully!\n";
    }

    void showAll() const {
        if (records.empty()) {
            cout << "No transactions to display.\n";
            return;
        }
        cout << "\n--- Transaction History ---\n";
        for (const auto& t : records)
            t->display();
    }

    double getBalance() const {
        double balance = 0;
        for (const auto& t : records)
            balance += t->isIncome() ? t->getAmount() : -t->getAmount();
        return balance;
    }
};

// Function to display menu
void showMenu() {
    cout << "\n--- MENU ---\n";
    cout << "1. Add Income\n";
    cout << "2. Add Expense\n";
    cout << "3. View All Transactions\n";
    cout << "4. View Balance\n";
    cout << "5. Exit\n";
    cout << "Choose an option: ";
}

// Main program logic
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
            cout << "Enter date: "; cin >> date;
            cout << "Enter amount: "; cin >> amount;
            cout << "Enter category: "; cin >> ws; getline(cin, category);
            fm.addTransaction(make_shared<Income>(date, amount, category));
            break;

        case 2:
            cout << "Enter date: "; cin >> date;
            cout << "Enter amount: "; cin >> amount;
            cout << "Enter category: "; cin >> ws; getline(cin, category);
            fm.addTransaction(make_shared<Expense>(date, amount, category));
            break;

        case 3:
            fm.showAll();
            break;

        case 4:
            cout << "Current Balance: " << fm.getBalance() << endl;
            break;

        case 5:
            cout << "Goodbye! Stay in control of your finances.\n";
            break;

        default:
            cout << "Invalid option. Please choose again.\n";
        }

    } while (choice != 5);

    return 0;
}
```

---

## ✍️ How To Explain in Viva

Let’s prep you for typical viva questions:

| Question | Suggested Answer |
|---------|-------------------|
| What is the role of `Transaction`? | It’s an abstract class that defines common behavior for both incomes and expenses. |
| Why use `shared_ptr`? | So we can store both `Income` and `Expense` objects in one list and manage memory safely. |
| How is polymorphism used? | The `display()` method is virtual, so it runs differently for `Income` and `Expense`. |
| What is the use of `getBalance()`? | It adds all incomes and subtracts all expenses to find the current balance. |
| What happens when `records` is empty? | The system shows a friendly message like “No transactions to display.” |

---
