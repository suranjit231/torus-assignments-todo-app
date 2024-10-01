# Task Management Application

## Task Management

This Task Management application is designed to help manage tasks efficiently with role-based authentication for Admin and User roles. Built using React and Redux for the frontend, and Node.js, Express, and MongoDB for the backend, it leverages JWT authentication to secure routes and manage user sessions.

### Features

- **User Authentication**: Users can sign up, sign in, and sign out.
- **Role-Based Access**: Admins and users have different permissions.
    - **Admin**: Create, edit, delete, assign, filter, and search tasks.
    - **User**: View tasks assigned to them and update task statuses (To-Do, In Progress,Completed).

- **Task Management**: Full CRUD operations on tasks for admins and status updates for users.

### User Authentication

- **Sign Up**: Users can create a new account.
- **Sign In**: Users can log in to their account.
- **Sign Out**: Users can log out of their account.

### Task CRUD Operations

- **Create Task**: Users can create a new task.
- **Read Tasks**: Users can view all their tasks.
- **Update Task**: Users can update an existing task.
- **Delete Task**: Users can delete a task.

## Setup and Configuration 

## Backend Setup

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/suranjit123/task-management.git

2. Navigate to the backend directory:
- **cd backend**

3. Install the required dependencies:
- **npm install**

4. Check the .env file for environment variables and make changes if necessary:
```
PORT=3200
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
5. Start the backend server:
- **node server.js**

## Frontend Setup

1. Navigate to the frontend directory:
- **cd client**

2. Install the required dependencies:
- **npm install**

3. Match the REACT_APP_SERVER_URL environment variable with your backend server URL in the .env file:
    - note: ( i have not removed the .env file from both frontend as well as backend. So, don't need to add .env file if you are not change it)
```
REACT_APP_SERVER_URL=http://localhost:3200
```
4. Start the frontend application:
- **npm start**

## How to Use and Test the Application:

- 1. After setting up both the backend and frontend, the application will be available at the specified port (e.g., http://localhost:3200).
- 2. Click the Start or Login button on the homepage.
- 3. If you don't have an account, create an Admin account first and then create 3-4 User accounts.
- 4. Log in with your admin credentials. Initially, there will be no tasks, so create and assign tasks to the users.
- 5. Explore the app as an admin (create, assign, delete, edit tasks).
- 6. Log out and log in as a user to explore the app from a user's perspective. View and update the status of tasks assigned to you.