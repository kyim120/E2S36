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
