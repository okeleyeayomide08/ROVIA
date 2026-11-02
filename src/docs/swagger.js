import crypto from "crypto";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// ========================================== //
// 1. Define the OpenAPI Specification Metadata //
// ========================================== //
const swaggerDefinition = {
  openapi: "3.2.0", // OpenAPI version (3.2.0 is the current standard)
  info: {
    title: "Rovia Career Platform API",
    version: "1.0.0",
    description:
      "RESTful API for the Rovia career growth platform. Handles user authentication, profile management, education, skills, experience, certifications, career goals, and interests.",
    contact: {
      name: "Rovia Engineering Team",
      email: "teamrovia@gmail.com",
    },
  },
  // "Try it out" sends requests to the URL below.
  // Set API_BASE_URL on the host (e.g. https://your-api-host/api/v1).
  // Falls back to localhost when it is not set.
  servers: [
    {
      url: process.env.API_BASE_URL || "http://localhost:5000/api/v1",
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Enter your JWT access token. Example: eyJhbGciOiJIUzI1NiIs...",
      },
    },
  },
  // Apply bearer auth globally to all endpoints by default
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// ========================================== //
// 2. Tell swagger-jsdoc Where to Find Your Route Comments //
// ========================================== //
const options = {
  swaggerDefinition,
  // Glob patterns pointing to files containing JSDoc API annotations
  apis: ["./src/modules/**/*.routes.js", "./src/routes/index.js"],
};

// ========================================== //
// 3. Generate the OpenAPI Specification //
// ========================================== //
const swaggerSpec = swaggerJsdoc(options);

// ========================================== //
// 4. Setup Function to Mount Swagger on Express App //
// ========================================== //
export function setupSwagger(app) {
  // Serve the interactive Swagger UI at /api-docs (Login removed)
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Raw OpenAPI JSON at /api-docs.json (Login removed)
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerSpec;
