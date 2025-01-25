# TrueFeedback

TrueFeedback is a platform where users can provide **anonymous feedback** to individuals or organizations without revealing their identity. Since anonymous feedback is often the most honest, TrueFeedback helps create a space for genuine, constructive, and unfiltered insights.


![Screenshot 2024-10-08 201846](https://github.com/user-attachments/assets/b3e0cf6c-6b28-4bcb-86d6-07c36ebfdda4)



## Features
- 📝 Anonymous feedback submission to users or organizations
- 🔒 Secure email verification for feedback recipients
- 🧑‍💻 User-friendly forms for submitting feedback
- 🕵️ Full anonymity for the feedback provider
- ⚡ Scalable and efficient tech stack

## Tech Stack

| Technology      | Icon                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Next.js**     | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| **MongoDB**     | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) |
| **Resend**      | ![Resend](https://img.shields.io/badge/Resend-FF4500?style=for-the-badge) |
| **React Hook Form** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=react&logoColor=white) |
| **Docker**      | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |

## Getting Started

### Prerequisites
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) Node.js (v18 or higher)
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) Docker (for containerized environment)
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) MongoDB instance (local or cloud)
- Resend API key for email verification

### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/truefeedback.git
    ```

2. Navigate to the project directory:
    ```bash
    cd truefeedback
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up your MongoDB connection string in an `.env` file:
    ```env
    MONGODB_URI=<your-mongodb-connection-string>
    RESEND_API_KEY=<your-resend-api-key>
    ```

5. Run the application:
    ```bash
    npm run dev
    ```

6. Access the app at `http://localhost:3000`

### Docker Setup

You can also run the application using Docker for consistent development or deployment environments.

1. Build the Docker image:
    ```bash
    docker build -t truefeedback .
    ```

2. Run the Docker container:
    ```bash
    docker run -p 3000:3000 truefeedback
    ```

The app will be available at `http://localhost:3000` in your browser.
