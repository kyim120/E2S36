### 🧱 1. **Header Files and Constants**
```cpp
#include <iostream>
#include <string>
using namespace std;

const int MAX_EXPENSES = 100;
```
- `#include <iostream>` and `#include <string>`: Let you use input/output (`cin`, `cout`) and strings.
- `using namespace std;`: Avoids writing `std::` before standard library names.
- `MAX_EXPENSES`: Sets a maximum limit for stored expenses (here, 100).

---

### 🧾 2. **Expense Class**
```cpp
class Expense {
    ...
};
```
Encapsulates data related to a **single** expense.

**Attributes:**
- `category`: Type of expense (e.g., Food, Travel).
- `date`: In format "DD-MM-YYYY".
- `amount`: Amount spent (as float).
- `description`: Additional info about the expense.

**Member Functions:**
- `input()`: Prompts user to enter each field.
- `display(int index)`: Displays a formatted summary of the expense.

🧠 _Smart usage_: `cin.ignore()` clears leftover input buffer, ensuring `getline()` works properly after `cin`.

---

### 🗃 3. **ExpenseManager Class**
```cpp
class ExpenseManager {
private:
    Expense expenses[MAX_EXPENSES];
    int count;
...
};
```
Handles multiple expenses using:
- `expenses[]`: Fixed-size array storing up to 100 `Expense` objects.
- `count`: Tracks the number of stored expenses.

---

### 🛠 4. **ExpenseManager Functions**

#### 📥 `addExpense()`
- Adds a new expense at the next available position.
- Uses `Expense::input()` to gather data.

#### 📋 `viewAllExpenses()`
- Lists all expenses by looping through `expenses[]`.
- Calls `display()` for each.

#### 📂 `viewByCategory()`
- Prompts user for a category.
- Filters and displays expenses that match.

#### 💵 `viewTotalExpense()`
- Sums up all amounts and displays the total spent.

#### ❌ `deleteExpense()`
- Deletes an expense by shifting the array elements.
- Input index is adjusted (`index - 1`) to match array positions.
- Reduces `count` accordingly.

---

### 🧠 5. **Main Function Logic**
```cpp
int main() {
    ExpenseManager manager;
    int choice;
    ...
}
```
Drives the entire program using a **menu loop**:

- Uses a `do-while` loop to repeat menu options until user selects Exit (`choice == 6`).
- Based on user input, the `switch` statement calls relevant `ExpenseManager` methods.

Each case (1–5) maps to a clear function:
| Menu Option | Action                     |
|-------------|----------------------------|
| 1           | Add new expense            |
| 2           | View all expenses          |
| 3           | View expenses by category  |
| 4           | View total expense         |
| 5           | Delete an expense          |
| 6           | Exit the program           |

---

### ⚙️ Additional Notes
- Repeated use of `cin.ignore()` shows you're mindful of common pitfalls with mixed input methods. ✅
- Would be even more robust with dynamic arrays or vectors (for future upgrades).
- Potential extensions: CSV export, date range filtering, monthly report generation.

# Code


```cpp
#include <iostream>
#include <string>
using namespace std;

const int MAX_EXPENSES = 100;

class Expense {
public:
    string category;
    string date;
    float amount;
    string description;

    void input() {
        cout << "Enter category: ";
        getline(cin, category);
        cout << "Enter date (DD-MM-YYYY): ";
        getline(cin, date);
        cout << "Enter amount: ";
        cin >> amount;
        cin.ignore(); // we used this here to clear newline due to complexity of program 
        cout << "Enter description: ";
        getline(cin, description);
    }

    void display(int index) const {
        cout << "Expense #" << index + 1 << "\n";
        cout << "Category   : " << category << "\n";
        cout << "Date       : " << date << "\n";
        cout << "Amount     : ?" << amount << "\n";
        cout << "Description: " << description << "\n";
        cout << "-------------------------\n";
    }
};

class ExpenseManager {
private:
    Expense expenses[MAX_EXPENSES];
    int count;

public:
    ExpenseManager() : count(0) {}

    void addExpense() {
        if (count >= MAX_EXPENSES) {
            cout << "Cannot add more expenses.\n";
            return;
        }
        cout << "\n--- Add New Expense ---\n";
        expenses[count].input();
        count++;
        cout << "Expense added successfully.\n";
    }

    void viewAllExpenses() const {
        if (count == 0) {
            cout << "No expenses recorded.\n";
            return;
        }
        cout << "\n--- All Expenses ---\n";
        for (int i = 0; i < count; i++) {
            expenses[i].display(i);
        }
    }

    void viewByCategory() const {
        if (count == 0) {
            cout << "No expenses recorded.\n";
            return;
        }
        cout << "Enter category to search: ";
        string searchCategory;
        getline(cin, searchCategory);
        bool found = false;
        for (int i = 0; i < count; i++) {
            if (expenses[i].category == searchCategory) {
                expenses[i].display(i);
                found = true;
            }
        }
        if (!found) {
            cout << "No expenses found in category: " << searchCategory << "\n";
        }
    }

    void viewTotalExpense() const {
        float total = 0;
        for (int i = 0; i < count; i++) {
            total += expenses[i].amount;
        }
        cout << "Total Expenses: ?" << total << "\n";
    }

    void deleteExpense() {
        if (count == 0) {
            cout << "No expenses to delete.\n";
            return;
        }
        cout << "Enter expense number to delete (1 to " << count << "): ";
        int index;
        cin >> index;
        cin.ignore(); // this was used to clear newline and any sort of buffer 
        if (index < 1 || index > count) {
            cout << "Invalid index.\n";
            return;
        }
        for (int i = index - 1; i < count - 1; i++) {
            expenses[i] = expenses[i + 1];
        }
        count--;
        cout << "Expense deleted.\n";
    }
};

int main() {
    ExpenseManager manager;  
    int choice;

    do {
        cout << "\n===== Expense Tracker =====\n";
        cout << "1. Add Expense\n";
        cout << "2. View All Expenses\n";
        cout << "3. View Expenses by Category\n";
        cout << "4. View Total Expense\n";
        cout << "5. Delete Expense\n";
        cout << "6. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        cin.ignore(); // this is used to clear newline

        switch (choice) {     //this is final options for all the output 
        case 1: manager.addExpense(); break;
        case 2: manager.viewAllExpenses(); break;
        case 3: manager.viewByCategory(); break;
        case 4: manager.viewTotalExpense(); break;
        case 5: manager.deleteExpense(); break;
        case 6: cout << "Exiting...\n"; break;
        default: cout << "Invalid choice. Try again.\n";
        }
    } while (choice != 6);
    
return 0;
}


```
