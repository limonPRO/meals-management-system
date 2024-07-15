

## Features

- Authentication: JWT-based authentication system with role-based access control.
- User Management: Admins can add, update, ban users, and manage roles.
- Item Management: Admins can add and delete items categorized into Protein, Starch, and Veg.
- Meal Management: Admins can set meal schedules for specific days with constraints on meal composition.
- Meal Ordering: General users can view and select meal choices for each day, with the ability to schedule meals for an entire month.
- Meal Schedule Viewing: Admins can view meal choices for every user.


##  Technology Stack
- Frontend: ReactJS, Redux, React Query
- Backend: NodeJS, Express, JWT for authentication
- Database: MySQL
## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js and npm installed
- MySQL database instance
- A mysql database created for this project
- Knowledge of TypeScript and Express framework

- 
## Run Locally

Clone the project

```bash
  https://github.com/limonPRO/BookStore.git
```

backend set up

```bash
 cd server/
```

Install dependencies

```bash
  npm install
npm run dev
```



Set up environment variables
- Create a .env file in the root directory and add the following variables:

```bash


PORT = 3000
HOST = "localhost"
DATABASE= "testdb"
USER = "root"
PASSWORD = ""


JWT_SECRET = "secret"
```

front end set up

```bash
 cd client-meals/
```

Install dependencies

```bash
  npm install
npm run dev
```



