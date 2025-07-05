Mie: Intelligent Food Suggestion App
🥗 Overview

"Mie" is an intelligent mobile application designed to revolutionize how users approach their dietary choices. Leveraging advanced AI (Gemini 2.5 Pro) and a robust microservices backend, Mie provides personalized food suggestions, tracks nutrition, and simplifies meal logging based on visual input and user-specific health data. It acts as an intelligent food companion, guiding users towards healthier and more informed eating choices.
✨ Key Features

    📷 Food Detection via Photo: Upload or take photos of meals for AI-driven identification and nutritional estimation.

    🧠 Intelligent Food Suggestions: Personalized meal and snack recommendations tailored to user profiles, dietary preferences, allergies, and caloric needs.

    📊 Calorie and Nutrition Tracker: Daily logging of consumed meals with detailed nutrition breakdowns and visual progress towards goals.

    🔍 Search & Filter: Comprehensive search for food items and recipes with advanced filtering options (diet type, allergies, cuisine, macros).

    👤 Profile & Settings: Management of personal information, dietary preferences, health conditions, and caloric goals.

    ⚡ Real-time Updates: Food detection results are pushed to the mobile app via WebSockets for an immediate user experience.

🚀 Tech Stack
Frontend (Mobile App)

    React Native (Expo): Cross-platform mobile development for iOS and Android.

    React Navigation: Intuitive routing and tab navigation.

    Axios: HTTP client for API calls.

    Zustand: Lightweight state management.

    Authentication: JWT-based Authentication, React Native Google Sign-In.

Backend (API Layer)

    Spring Boot: Robust framework for RESTful API services and business logic.

    Spring Boot Security: JWT authentication and OAuth2 (Google).

    PostgreSQL: Primary database for persistent storage (user profiles, preferences, meal history, food/recipe database).

    Redis: In-memory data store for caching, rate limiting, and short-lived processing results.

    RabbitMQ: Message broker for asynchronous communication and background tasks (image processing, AI calls).

    Cloudinary: Cloud-based service for image upload, storage, transformation, and delivery.

    Gemini 2.5 Pro: Advanced multimodal AI model for food identification, reasoning, and suggestion generation.

🏗️ Architecture

Mie employs a microservices-oriented architecture to ensure scalability, resilience, and maintainability.

+-------------------+       +---------------------------+
|                   |       |                           |
|  React Native App |       |  Spring Boot API GW       |
| (Zustand State)   |------>| (Spring Security JWT/OAuth,|
|                   |       |  Cloudinary Upload API)   |
+-------------------+       +-------------+-------------+
^                            |
|                            | 1. Uploads image to Cloudinary
| (WebSocket)                | 2. Publishes message to RabbitMQ
| Push Results               |
v                            v
+-----------------------+       +-----------------------+
|                       |       |                       |
|   Cloudinary          |<------| Worker Service        |
| (Image Storage)       |       | (Image Processing)    |
|                       |       | - Consumes from Queue |
+-----------------------+       | - Calls Gemini 2.5 Pro|
| - Publishes to next Q |
+-----------+-----------+
|
| Message (identifiedFoodData)
v
+-----------------------+
|                       |
| RabbitMQ Queues       |
| (Image & Suggestion   |
|  Tasks)               |
+-----------+-----------+
|
| Message (identifiedFoodData, userId)
v
+-----------------------+
|                       |
| Meal Suggestion Service|
| (Spring Boot)         |
| - Fetches User Profile|
| - Calls Gemini 2.5 Pro|
| - Stores result in Redis |
| - Pushes via WebSocket|
+-----------------------+

    React Native Mobile App: Handles UI, user interaction, photo capture/upload, and real-time result display via WebSockets.

    Spring Boot API Gateway: The central entry point, managing authentication, image uploads, and initiating asynchronous processing.

    Cloudinary: Dedicated service for robust image handling.

    Worker Service: Processes images using Gemini 2.5 Pro.

    RabbitMQ: Decouples services and manages the asynchronous workflow.

    Meal Suggestion Service: Generates personalized suggestions, stores results, and pushes them to the client.

    PostgreSQL: The core data store for all persistent application data.

    Redis: Used for high-speed caching and temporary data storage.

🔐 API Endpoints

The backend exposes a comprehensive set of RESTful API endpoints, all prefixed with /api/v1. For detailed information on each endpoint, including request/response formats, authentication requirements, and error handling, please refer to the API Endpoints Document.

Key endpoint categories include:

    Authentication: User registration, login, Google Sign-In, token refresh.

    User Profile & Settings: Retrieve, update, and delete user profiles.

    Food Detection & Suggestion: Upload photos, receive real-time detection results via WebSockets, get personalized meal suggestions.

    Meal Logging: Log, retrieve, update, and delete daily meal entries.

    Calorie and Nutrition Tracking: Get daily summaries and historical nutrition data.

    Search & Filter: Search for recipes and individual food items.

🛠️ Setup and Installation

To set up and run Mie locally, follow these steps:

    Clone the repository:

    git clone https://github.com/your-repo/mie.git
    cd mie

    Backend Setup (Spring Boot):

        Navigate to the backend directory.

        Ensure you have Java 17+ and Maven installed.

        Configure your application.properties or application.yml with database (PostgreSQL), Redis, RabbitMQ, Cloudinary, and Gemini API credentials.

        Run database migrations (e.g., Flyway or Liquibase).

        Build and run the backend:

        ./mvnw clean install
        ./mvnw spring-boot:run

    Frontend Setup (React Native):

        Navigate to the frontend (or mobile-app) directory.

        Ensure you have Node.js, npm/yarn, and Expo CLI installed.

        Install dependencies:

        npm install # or yarn install

        Configure your environment variables for the backend API URL and WebSocket URL.

        Start the Expo development server:

        npx expo start

        Scan the QR code with your mobile device (Expo Go app) or run on an emulator/simulator.

💡 Usage

(Detailed instructions on how to use the app will go here once the UI is developed. For example: "Launch the app, sign in or register. Tap the camera icon to upload a meal photo. View AI-identified items and personalized suggestions. Log your meals from the suggestions or search for specific foods.")
🤝 Contributing

Contributions are welcome! Please refer to CONTRIBUTING.md for guidelines on how to contribute to this project.
📄 License

This project is licensed under the MIT License. See the LICENSE file for details.