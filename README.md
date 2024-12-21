# Travel-Booking-Website (Voyawander)

Voyawander is a modern and intuitive travel booking platform built using the MERN stack. The website allows users to browse destinations, book hotels, flights, and confirm their bookings securely. Special features like email verification via OTP and PDF generation of booking details enhance the overall experience.

Snowflakes adorn the interface during the Christmas season, bringing festive cheer to users, with a toggle to enable or disable them. This project serves as a fun practice endeavor showcasing best coding practices, reusable components, and robust security mechanisms.


[Voyawander](https://dc-voyawander.vercel.app/) - Explore the live site now!

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Protected Routes](#protected-routes)
- [Backend Security](#backend-security)
- [Stripe Payment Integration](#stripe-payment-integration)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Contact](#contact)
- [Screenshots](#screenshots)

---


## Features

- **Responsive Design**: Mobile-first responsive UI for seamless browsing.
- **User Authentication**: Secure login and signup using JWT tokens.
- **Protected Routes**: Access control based on user state.
- **Email Verification**: OTP-based email verification.
- **Secure Payment**: Stripe payment gateway integration (test mode).
- **Booking Details PDF**: Automated booking confirmation email with a detailed PDF attachment.
- **Session Management**: Leveraging `sessionStorage` for efficient state handling.
- **Redis Caching**: Temporary data storage for enhanced performance and security.
- **Contact Form**: Users can send inquiries through the contact form.
- **Christmas Mode**: Toggleable snowfall animation for seasonal celebrations.

---

## Tech Stack

### Frontend
- React.js (v18.3.1)
- Context API for state management
- React Router (v7.0.1)
- React Toastify for notifications
- React Icons for UI components
- React Snowfall for seasonal effects
- Axios for API integration

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Redis for caching OTPs and pre-payment data
- Bcrypt for password encryption
- JSON Web Tokens (JWT) for secure authentication
- Nodemailer for email services
- Stripe API for payment processing
- PDFKit for generating PDFs
- XSS for input sanitization

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Redis server

### Steps

#### Clone the Repository
```bash
$ git clone https://github.com/yourusername/voyawander.git
$ cd voyawander
```

#### Frontend Setup
```bash
$ cd frontend
$ npm install
$ npm start
```

#### Backend Setup
```bash
$ cd backend
$ npm install
$ npm start
```

---

## Usage

### Routes Structure
Frontend routes are protected to ensure proper access based on user state, if user don't have proper access then it will redirect to the Not found page.

---

## Protected Routes
- Frontend routes are guarded using `user` and `booking` states.
- Backend routes are protected using JWT tokens and CORS policies.
- Validation is performed both on the client and server sides to ensure data integrity and prevent security vulnerabilities.

---

## Backend Security
- Input Sanitization: XSS library ensures inputs are free from malicious scripts.
- Email Verification: OTPs stored temporarily in Redis for enhanced security.
- Encrypted Passwords: Bcrypt library secures user passwords.
- Secure Payment: Stripe handles payments in test mode with fake VISA card details.

---

## Stripe Payment Integration
- Fully functional payment system using Stripe in test mode.
- Users can simulate transactions using provided test credentials.
- Payments are processed only for valid bookings; data is stored in MongoDB upon successful transactions.

---

## State Management
- Context API for managing global state.
- Session storage used to persist data between hard refreshes, improving user experience.

---

## Deployment

- **Frontend**: [Vercel](https://dc-voyawander.vercel.app/)
- **Backend**: [Render](https://travel-booking-website-6x9h.onrender.com)

---

## Contact

For any questions or feedback, feel free to reach out:

- **Email**: voyawander@gmail.com

---

## Screenshots
![Home](https://github.com/user-attachments/assets/ec993fb3-4974-4260-9bcc-cd5f561240dd)
![Destination](https://github.com/user-attachments/assets/48e45375-4c42-4ea6-bced-486eccfb5e4e)
![Flights](https://github.com/user-attachments/assets/7b0a7c13-b500-4122-9f95-350eaa74b695)
![Email](https://github.com/user-attachments/assets/20f53f56-f204-4efc-98fc-9e20f618fe0d)
![Register](https://github.com/user-attachments/assets/443ad4a2-f73d-4186-b0c3-1a35c29d1af1)
![Login](https://github.com/user-attachments/assets/d3f15413-a0a9-40be-b3d2-0af09fb3204a)
![Booking](https://github.com/user-attachments/assets/b166595a-931b-44ba-ab01-a8aeb95113aa)
![Details](https://github.com/user-attachments/assets/db7948a0-9f6a-429c-8826-e8d48810771c)
![Payment](https://github.com/user-attachments/assets/677f64c5-46e5-4b0e-a6e0-90be283fcc48)
![Final](https://github.com/user-attachments/assets/fbe35bf7-5e45-47b7-9a45-7036230c363d)
![Gmail](https://github.com/user-attachments/assets/b2b286dc-e8be-47de-9457-228318ecf614)
![DetailsPdf](https://github.com/user-attachments/assets/08a79977-ea09-43f4-8da5-742177db0c24)


---

### License
This project is licensed under the [MIT License](LICENSE).

---
