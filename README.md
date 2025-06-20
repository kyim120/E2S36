# **Hospital Management System** in **C++**

* **Class hierarchies** (for patients, doctors, appointments, and billing)
* **File I/O** (to save/load records)

---

### 🏗 Structure Overview

1. **Base class**: `Person`

   * Derived: `Patient`, `Doctor`
2. **Appointment class**
3. **Billing class**
4. **File I/O**: Save/Load data for patients, doctors, appointments

---

### ✅ Features

* Add/view patients and doctors
* Schedule/view appointments
* Generate bills
* Save/load all data from files

---

### 💻 Full C++ Code

```cpp
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
using namespace std;

class Person {
public:
    string name;
    int age;

    Person(string n = "", int a = 0) : name(n), age(a) {}

    virtual void display() const {
        cout << "Name: " << name << "\nAge: " << age << endl;
    }
};

class Patient : public Person {
public:
    int patientID;
    string disease;

    Patient(int id = 0, string n = "", int a = 0, string d = "")
        : Person(n, a), patientID(id), disease(d) {}

    void display() const override {
        cout << "Patient ID: " << patientID << endl;
        Person::display();
        cout << "Disease: " << disease << endl;
    }

    void save(ofstream& out) const {
        out << patientID << "," << name << "," << age << "," << disease << "\n";
    }

    static Patient load(const string& line) {
        int id, age;
        string name, disease;
        sscanf(line.c_str(), "%d,%[^,],%d,%[^,\n]", &id, &*name.begin(), &age, &*disease.begin());
        return Patient(id, name, age, disease);
    }
};

class Doctor : public Person {
public:
    int doctorID;
    string specialization;

    Doctor(int id = 0, string n = "", int a = 0, string s = "")
        : Person(n, a), doctorID(id), specialization(s) {}

    void display() const override {
        cout << "Doctor ID: " << doctorID << endl;
        Person::display();
        cout << "Specialization: " << specialization << endl;
    }

    void save(ofstream& out) const {
        out << doctorID << "," << name << "," << age << "," << specialization << "\n";
    }

    static Doctor load(const string& line) {
        int id, age;
        string name, spec;
        sscanf(line.c_str(), "%d,%[^,],%d,%[^,\n]", &id, &*name.begin(), &age, &*spec.begin());
        return Doctor(id, name, age, spec);
    }
};

class Appointment {
public:
    int appointmentID;
    int patientID;
    int doctorID;
    string date;

    Appointment(int aid = 0, int pid = 0, int did = 0, string d = "")
        : appointmentID(aid), patientID(pid), doctorID(did), date(d) {}

    void display() const {
        cout << "Appointment ID: " << appointmentID
             << "\nPatient ID: " << patientID
             << "\nDoctor ID: " << doctorID
             << "\nDate: " << date << endl;
    }

    void save(ofstream& out) const {
        out << appointmentID << "," << patientID << "," << doctorID << "," << date << "\n";
    }

    static Appointment load(const string& line) {
        int aid, pid, did;
        string date;
        sscanf(line.c_str(), "%d,%d,%d,%[^,\n]", &aid, &pid, &did, &*date.begin());
        return Appointment(aid, pid, did, date);
    }
};

class Billing {
public:
    int billID;
    int patientID;
    double amount;

    Billing(int bid = 0, int pid = 0, double amt = 0.0)
        : billID(bid), patientID(pid), amount(amt) {}

    void display() const {
        cout << "Bill ID: " << billID
             << "\nPatient ID: " << patientID
             << "\nAmount: $" << amount << endl;
    }

    void save(ofstream& out) const {
        out << billID << "," << patientID << "," << amount << "\n";
    }

    static Billing load(const string& line) {
        int bid, pid;
        double amt;
        sscanf(line.c_str(), "%d,%d,%lf", &bid, &pid, &amt);
        return Billing(bid, pid, amt);
    }
};

// ----------------- Main ------------------

int main() {
    vector<Patient> patients;
    vector<Doctor> doctors;
    vector<Appointment> appointments;
    vector<Billing> bills;

    int choice;
    do {
        cout << "\nHospital Management System\n";
        cout << "1. Add Patient\n2. Add Doctor\n3. Add Appointment\n4. Generate Bill\n5. Display All\n6. Save Data\n7. Exit\nChoice: ";
        cin >> choice;

        if (choice == 1) {
            Patient p;
            cout << "Enter ID, Name, Age, Disease: ";
            cin >> p.patientID >> ws;
            getline(cin, p.name);
            cin >> p.age >> ws;
            getline(cin, p.disease);
            patients.push_back(p);
        } else if (choice == 2) {
            Doctor d;
            cout << "Enter ID, Name, Age, Specialization: ";
            cin >> d.doctorID >> ws;
            getline(cin, d.name);
            cin >> d.age >> ws;
            getline(cin, d.specialization);
            doctors.push_back(d);
        } else if (choice == 3) {
            Appointment a;
            cout << "Enter Appointment ID, Patient ID, Doctor ID, Date: ";
            cin >> a.appointmentID >> a.patientID >> a.doctorID >> ws;
            getline(cin, a.date);
            appointments.push_back(a);
        } else if (choice == 4) {
            Billing b;
            cout << "Enter Bill ID, Patient ID, Amount: ";
            cin >> b.billID >> b.patientID >> b.amount;
            bills.push_back(b);
        } else if (choice == 5) {
            cout << "\n--- Patients ---\n";
            for (auto& p : patients) p.display();

            cout << "\n--- Doctors ---\n";
            for (auto& d : doctors) d.display();

            cout << "\n--- Appointments ---\n";
            for (auto& a : appointments) a.display();

            cout << "\n--- Bills ---\n";
            for (auto& b : bills) b.display();
        } else if (choice == 6) {
            ofstream pf("patients.txt"), df("doctors.txt"), af("appointments.txt"), bf("bills.txt");
            for (auto& p : patients) p.save(pf);
            for (auto& d : doctors) d.save(df);
            for (auto& a : appointments) a.save(af);
            for (auto& b : bills) b.save(bf);
            cout << "Data saved to files.\n";
        }
    } while (choice != 7);

    return 0;
}
```

---

### 📁 Output Files

* `patients.txt`
* `doctors.txt`
* `appointments.txt`
* `bills.txt`

---

### 📝 Notes

* You can add file **load** functionality at startup by reading each file line-by-line.
* Error handling can be added for robustness.
* IDs should be auto-generated or validated in a real system.

---

# **EXE step by step**

---

## 🔹 1. **Header Files**

```cpp
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
using namespace std;
```

### 🧠 Explanation:

* `iostream`: For input/output (e.g., `cin`, `cout`)
* `fstream`: For file input/output (e.g., `ofstream`, `ifstream`)
* `vector`: To use dynamic arrays for storing objects
* `string`: For working with strings
* `using namespace std;`: So you don't need to type `std::` everywhere

---

## 🔹 2. **Base Class: Person**

```cpp
class Person {
public:
    string name;
    int age;

    Person(string n = "", int a = 0) : name(n), age(a) {}

    virtual void display() const {
        cout << "Name: " << name << "\nAge: " << age << endl;
    }
};
```

### 🧠 Explanation:

* A base class for both `Patient` and `Doctor`.
* Contains common attributes: `name` and `age`.
* `virtual display()` allows derived classes to override it.

---

## 🔹 3. **Derived Class: Patient**

```cpp
class Patient : public Person {
public:
    int patientID;
    string disease;

    Patient(int id = 0, string n = "", int a = 0, string d = "")
        : Person(n, a), patientID(id), disease(d) {}

    void display() const override {
        cout << "Patient ID: " << patientID << endl;
        Person::display();
        cout << "Disease: " << disease << endl;
    }

    void save(ofstream& out) const {
        out << patientID << "," << name << "," << age << "," << disease << "\n";
    }
};
```

### 🧠 Explanation:

* Inherits from `Person`.
* Adds `patientID` and `disease`.
* Overrides `display()` to show patient details.
* `save()` writes the patient data to a file.

---

## 🔹 4. **Derived Class: Doctor**

```cpp
class Doctor : public Person {
public:
    int doctorID;
    string specialization;

    Doctor(int id = 0, string n = "", int a = 0, string s = "")
        : Person(n, a), doctorID(id), specialization(s) {}

    void display() const override {
        cout << "Doctor ID: " << doctorID << endl;
        Person::display();
        cout << "Specialization: " << specialization << endl;
    }

    void save(ofstream& out) const {
        out << doctorID << "," << name << "," << age << "," << specialization << "\n";
    }
};
```

### 🧠 Explanation:

* Same idea as `Patient`.
* Inherits from `Person`.
* Adds `doctorID` and `specialization`.
* `save()` writes doctor data to file.

---

## 🔹 5. **Appointment Class**

```cpp
class Appointment {
public:
    int appointmentID;
    int patientID;
    int doctorID;
    string date;

    Appointment(int aid = 0, int pid = 0, int did = 0, string d = "")
        : appointmentID(aid), patientID(pid), doctorID(did), date(d) {}

    void display() const {
        cout << "Appointment ID: " << appointmentID
             << "\nPatient ID: " << patientID
             << "\nDoctor ID: " << doctorID
             << "\nDate: " << date << endl;
    }

    void save(ofstream& out) const {
        out << appointmentID << "," << patientID << "," << doctorID << "," << date << "\n";
    }
};
```

### 🧠 Explanation:

* Represents an appointment between a patient and a doctor.
* Includes date and IDs to link to both.
* `display()` shows details.
* `save()` stores it in a file.

---

## 🔹 6. **Billing Class**

```cpp
class Billing {
public:
    int billID;
    int patientID;
    double amount;

    Billing(int bid = 0, int pid = 0, double amt = 0.0)
        : billID(bid), patientID(pid), amount(amt) {}

    void display() const {
        cout << "Bill ID: " << billID
             << "\nPatient ID: " << patientID
             << "\nAmount: $" << amount << endl;
    }

    void save(ofstream& out) const {
        out << billID << "," << patientID << "," << amount << "\n";
    }
};
```

### 🧠 Explanation:

* Represents a billing record for a patient.
* `display()` prints the bill.
* `save()` stores it in a file.

---

## 🔹 7. **Main Function**

```cpp
int main() {
    vector<Patient> patients;
    vector<Doctor> doctors;
    vector<Appointment> appointments;
    vector<Billing> bills;
```

### 🧠 Explanation:

* These `vector`s store all records in memory during the program execution.

---

## 🔹 8. **User Menu**

```cpp
int choice;
do {
    cout << "\nHospital Management System\n";
    cout << "1. Add Patient\n2. Add Doctor\n3. Add Appointment\n4. Generate Bill\n5. Display All\n6. Save Data\n7. Exit\nChoice: ";
    cin >> choice;
```

* A loop that keeps showing options until the user chooses to exit.

---

## 🔹 9. **Option 1: Add Patient**

```cpp
if (choice == 1) {
    Patient p;
    cout << "Enter ID, Name, Age, Disease: ";
    cin >> p.patientID >> ws;
    getline(cin, p.name);
    cin >> p.age >> ws;
    getline(cin, p.disease);
    patients.push_back(p);
}
```

* Takes input from user.
* Creates a `Patient` object and adds it to `patients` vector.

---

## 🔹 10. **Option 2: Add Doctor**

Same logic as adding a patient.

---

## 🔹 11. **Option 3: Add Appointment**

```cpp
Appointment a;
cout << "Enter Appointment ID, Patient ID, Doctor ID, Date: ";
cin >> a.appointmentID >> a.patientID >> a.doctorID >> ws;
getline(cin, a.date);
appointments.push_back(a);
```

* Links a doctor and patient via IDs and stores the date.

---

## 🔹 12. **Option 4: Generate Bill**

```cpp
Billing b;
cout << "Enter Bill ID, Patient ID, Amount: ";
cin >> b.billID >> b.patientID >> b.amount;
bills.push_back(b);
```

* Creates and stores a billing record.

---

## 🔹 13. **Option 5: Display All**

```cpp
for (auto& p : patients) p.display();
for (auto& d : doctors) d.display();
for (auto& a : appointments) a.display();
for (auto& b : bills) b.display();
```

* Loops through each vector and displays the contents.

---

## 🔹 14. **Option 6: Save to Files**

```cpp
ofstream pf("patients.txt"), df("doctors.txt"), af("appointments.txt"), bf("bills.txt");
for (auto& p : patients) p.save(pf);
for (auto& d : doctors) d.save(df);
for (auto& a : appointments) a.save(af);
for (auto& b : bills) b.save(bf);
```

* Writes all records to 4 different files for persistence.

---

## 🔹 15. **Option 7: Exit**

```cpp
} while (choice != 7);
```

* Loops until the user enters 7.

---

## ✅ Summary

| Class         | Purpose                           |
| ------------- | --------------------------------- |
| `Person`      | Base class for common attributes  |
| `Patient`     | Derived class with ID & disease   |
| `Doctor`      | Derived class with ID & specialty |
| `Appointment` | Connects patient & doctor         |
| `Billing`     | Handles patient billing           |
| `main()`      | Menu interface, I/O, file saving  |

---
