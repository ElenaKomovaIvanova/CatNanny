# Welcome to the Catnanny Platform 🐾

The Catnanny Platform is a web application designed to streamline the process of finding and booking cat sitters (catnannies) and providing a structured system for communication and tracking orders. Built with a robust tech stack and equipped with real-time communication, our platform is both scalable and secure.

## Platform Overview:
This project offers a set of tools to simplify the search, booking, and interaction between cat owners and caregivers.

### Visit the live site:
[Catnanny Platform](https://catnanny-1.onrender.com/)

---

## Features

- **Cat Care Profiles**: Customize your profile to show your experience, availability, and services offered.
- **Service Requests**: Easily manage booking requests and keep track of active services.
- **Availability Scheduling**: Check the calendar for open dates, and manage your availability.
- **Real-Time Messaging**: Direct chat to discuss details, coordinate schedules, and keep everyone updated.
- **Reviews & Ratings**: Share your experiences and help grow a trusted community.

## Tech Stack

- **Backend**: Django with Django Channels for live chat
- **Frontend**: TypeScript + React + Redux for modern, reactive interfaces
- **Database**: Neon.tech
- **File Storage**: Amazon S3 for secure photo storage
- **Auth**: JSON Web Tokens (JWT) for secure authentication
- **Deployment**: Docker and Nginx

---

### Libraries

- **@aws-sdk/client-s3** for Amazon S3 file handling
- **bcrypt** for secure password hashing
- **cropperjs** for browser-based image cropping
- **dotenv** for environment variable management
- **express-validator** for user input validation
- **jsonwebtoken** for JWT-based authentication
- **knex** for SQL queries
- **multer** for file uploads
- **sharp** for photo processing

---

### Environment Setup

Create a `.env` file and include these settings:

```dotenv
DATABASE_URL=DATABASE_URL
NAME=NAME
USER=USER
PASSWORD=PASSWORD
HOST=HOST
SECRET_KEY=SECRET_KEY
DEFAULT_FILE_STORAGE=DEFAULT_FILE_STORAGE
AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY
AWS_STORAGE_BUCKET_NAME=AWS_STORAGE_BUCKET_NAME
AWS_S3_REGION_NAME=AWS_S3_REGION_NAME
DJANGO_SETTINGS_MODULE=backend.settings
REACT_APP_API_URL=REACT_APP_API_URL
