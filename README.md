
# 🧑‍💼 Employee Management System

A full-stack **Employee Management System** built with **Angular** and **Spring Boot**, designed to streamline the process of managing employees, roles, and departments in a modern web interface.

<!-- ![Project Screenshot](https://via.placeholder.com/1200x600?text=Employee+Management+System)  Replace with your own screenshot -->

---

## 🚀 Features

- 🔐 Secure login for admins
- ➕ Add, edit, and delete employees
- 🧾 View employee details in a modern table
- 🔍 Search and sort employee records
- 🏢 Department and role management *(optional extension)*
- 📦 RESTful API with Spring Boot
- 💾 Persistent data storage with SQL database

---

## 🛠️ Tech Stack

### Frontend
- [Angular](https://angular.io/) 17+
- [Tailwind CSS](https://tailwindcss.com/) (optional, for styling)
- Angular Router, Services, HttpClient

### Backend
- [Spring Boot](https://spring.io/projects/spring-boot)
- REST API with layered architecture (Controller, Service, Repository)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Flyway](https://flywaydb.org/) *(for schema migrations, optional)*

### Database
- PostgreSQL*

---

## 📁 Project Structure

### Angular
```

src/
├── app/
│   ├── core/            # Services, guards, interceptors
│   ├── shared/          # Reusable components (e.g., table, modals)
│   ├── features/
│   │   └── employees/   # Components + pages for employees
│   └── app-routing.module.ts

```

### Spring Boot
```

src/
├── main/
│   ├── java/com/example/employees/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── model/
│   └── resources/
│       ├── application.properties
│       └── db/migration/  # Flyway scripts (optional)

````

---

## ⚙️ Setup Instructions

### 📦 Backend (Spring Boot)

```bash
# Clone the repo
git clone https://github.com/fanyicharllson/Employee-Management-App-in-Angular.git
cd backend_spring_boot

# Update DB config in src/main/resources/application.properties

# Run the backend
./mvnw spring-boot:run
````

### 🌐 Frontend (Angular)

```bash
cd frontend_angular

# Install dependencies
npm install

# Run the frontend
ng serve
```

Then open `http://localhost:4200` in your browser.

---

## 🔒 Admin Login

---

## 🤝 Contributing

PRs and suggestions are welcome! If you'd like to contribute, fork the repo and submit a pull request.

---

## 📄 License

MIT License © [A Product of CharlseEmpire Tech](https://github.com/fanyicharllson)


## 👨‍💻 Built By

**Fanyi Charllson Fanyi**
*Builder & CTO-Minded Software Architect*
[CharlseEmpire Tech](https://charlseempire.netlify.app/landing-page)

