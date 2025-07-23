# CRICSTORE COLLECTION SERVICE

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Product Routes](#product-routes)
  - [Category Routes](#category-routes)
  - [Accessory Routes](#accessory-routes)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Project Overview

This project is a TypeScript-based service for managing collections, including products, categories, and accessories. It's built with **Node.js** and **Express**, and it uses **MongoDB** with **Mongoose** for data persistence. The service provides a RESTful API for CRUD operations on these resources, with features like file uploads to **AWS S3** and integration with **Kafka** for messaging.

---

## Features

-   **Product Management:** Complete CRUD operations for products, including image uploads.
-   **Category Management:** Functionalities for creating, updating, and deleting product categories.
-   **Accessory Management:** CRUD operations for accessories, including image uploads.
-   **File Storage:** Uses AWS S3 for storing product and accessory images.
-   **Messaging:** Integrates with Kafka for producing messages on product events.
-   **Role-Based Access Control:** Secures endpoints based on user roles (Admin, Manager).

---

## Getting Started

### Prerequisites

-   Node.js (v22.14.0)
-   MongoDB
-   AWS S3 Bucket
-   Kafka Broker
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adarsh-naik-2004/bats-collection_service.git
    cd bats-collection_service
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Environment Variables:** Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a template.
    ```
    PORT=...
    NODE_ENV=...
    DB_URL=...
    JWKS_URI=...
    S3_ACCESS_KEY=...
    S3_SECRET_KEY=...
    S3_REGION=...
    S3_BUCKET=...
    KAFKA_BROKER=...
    KAFKA_USERNAME=...
    KAFKA_PASSWORD=...
    CLIENT_UI=...
    ADMIN_UI=...
    ```

### Running the application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be running on the port specified in your `.env` file.

---

## API Documentation

### Product Routes

-   `POST /products`: Create a new product.
-   `PUT /products/:productId`: Update a product.
-   `GET /products`: Get a list of all products.
-   `DELETE /products/:productId`: Delete a product.
-   `POST /products/prices`: Get prices for a list of products.

### Category Routes

-   `POST /categories`: Create a new category.
-   `PATCH /categories/:categoryId`: Update a category.
-   `GET /categories`: Get a list of all categories.
-   `GET /categories/:categoryId`: Get a single category by ID.
-   `DELETE /categories/:categoryId`: Delete a category.

### Accessory Routes

-   `POST /accessorys`: Create a new accessory.
-   `GET /accessorys`: Get a list of all accessories.
-   `POST /accessorys/prices`: Get prices for a list of accessories.

---

## Project Structure

The project follows a modular structure, with each resource having its own directory containing the controller, service, model, and validator.

-   `src/`: Contains the main source code.
    -   `product/`: Contains all files related to products.
    -   `category/`: Contains all files related to categories.
    -   `accessory/`: Contains all files related to accessories.
    -   `common/`: Includes shared utilities, middlewares, and services.
    -   `config/`: Includes configuration files for the database, logger, Kafka, etc.
-   `docker/`: Includes Dockerfiles for development and production environments.

---

## Testing

The project uses **Jest** for testing. To run the tests, use the following command:

```bash
npm test
```

## Deployment
The project includes Docker configurations for easy deployment. The production Dockerfile creates a lean, optimized image for deployment. You can build and run the Docker container using the following commands:
```bash
docker build -t collection-service .
docker run -p <port>:<port> collection-service
```
