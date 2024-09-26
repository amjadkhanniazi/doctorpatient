# Doctor-Patient Appointment System

This is a Doctor-Patient Appointment Management System built using **Node.js** and **Express.js**, with **MongoDB** as the database. It includes features for user authentication, role-based authorization, appointment booking, prescription management, and more.

## Features

1. **User Authentication**:
   - Doctors and Patients can register and log in.
   - Secure authentication using tokens (JWT).
   
2. **Role-based Authorization**:
   - Authorization middleware that restricts access based on user roles (Doctor or Patient).

3. **Appointment Management**:
   - Patients can book new appointments with doctors.
   - Doctors can approve or reject appointments.
   - Patients can view their appointments.
   
4. **Prescription Management**:
   - Doctors can create, update, and delete prescriptions for patients.
   - Doctors can add or modify medications within a prescription.
   - Patients can view their prescriptions.

## Folder Structure

```
DoctorPatient/
│
├── config/
│   ├── config.js         # Contains MongoDB URL
│   └── db.js             # Database connection logic
│
├── middleware/
│   ├── authentication.js # Token-based authentication
│   └── authorization.js  # Role-based authorization logic
│
├── model/
│   ├── appointment.js    # Schema for managing appointments
│   ├── doctors.js        # Schema for doctor-specific details
│   ├── patients.js       # Schema for patient-specific details
│   ├── perscription.js   # Schema for prescription details (medications, diagnosis)
│   └── user.js           # User schema for both Doctors and Patients
│
├── route/
│   ├── appAPI.js         # Routes for managing appointments (book, approve, reject, delete)
│   ├── auth.js           # Routes for user registration and login
│   └── perAPI.js         # Routes for managing prescriptions (create, update, delete)
│
├── .env                  # Environment variables (e.g., MongoDB URL)
├── index.js              # Main entry point for the application
├── package.json          # Node.js dependencies and scripts
└── package-lock.json     # Dependency lock file
```

## API Endpoints

### Authentication (Auth)

- **POST** `/auth/doc/register` – Register a new Doctor.
- ![Register Doctor](https://github.com/amjadkhanniazi/doctorpatient/blob/add-screenshots-folder/updateMedication.jpg?raw=true)
- **POST** `/auth/pat/register` – Register a new Patient.
- **POST** `/auth/login` – Log in a user (Doctor or Patient).

### Appointment Management (AppAPI)

- **POST** `/appointment/new` – Patients can book a new appointment (authentication and authorization required).
- **DELETE** `/appointment/delete?id=APPOINTMENT_ID` – Delete an appointment (authentication required).
- **PATCH** `/appointment/approve?id=APPOINTMENT_ID` – Approve an appointment (Doctor authorization required).
- **PATCH** `/appointment/reject?id=APPOINTMENT_ID` – Reject an appointment (Doctor authorization required).

### Prescription Management (PerAPI)

- **POST** `/per/new` – Doctors can create a new prescription for a patient.
- **PATCH** `/per/add-medication?id=PER_ID` – Add medication to an existing prescription.
- **PATCH** `/per/update-medication?per_id=PER_ID&med_id=MED_ID` – Update a specific medication in a prescription.
- **DELETE** `/per/delete-medication?per_id=PER_ID&med_id=MED_ID` – Delete a specific medication from a prescription.

## Installation & Setup

### Prerequisites

- **Node.js**: Ensure Node.js is installed. You can download it from [Node.js](https://nodejs.org/).
- **MongoDB**: You should have MongoDB installed and running locally or have a connection string to a cloud MongoDB instance.

### Steps

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd DoctorPatient
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory and add your MongoDB URL:
      ```
      MongoURL='your_mongodb_connection_string'
      ```

4. Run the server:
    ```bash
    npm start
    ```

   The server will run on `http://localhost:5000`.

## Usage

- Register as a Doctor or Patient using the respective registration endpoints.
- Log in to receive a token.
- Use the token to authenticate requests to the appointment and prescription APIs.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (JSON Web Tokens)** for authentication
- **Mongoose** for MongoDB interactions
