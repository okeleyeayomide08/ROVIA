import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// ==========================================
// 1. Define the OpenAPI Specification Metadata
// ==========================================
const swaggerDefinition = {
  openapi: "3.2.0", // OpenAPI version (3.2.0 is the current standard)
  info: {
    title: "Rovia Career Platform API",
    version: "1.0.0",
    description:
      "RESTful API for the Rovia career growth platform. Handles user authentication, profile management, education, skills, experience, certifications, career goals, and interests.",
    contact: {
      name: "Rovia Engineering Team",
      email: "engineering@rovia.app",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local development server",
    },
    // You will add your production URL here later, e.g.:
    // {
    //   url: 'https://api.rovia.app/api/v1',
    //   description: 'Production server',
    // },
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

// ==========================================
// 2. Tell swagger-jsdoc Where to Find Your Route Comments
// ==========================================
const options = {
  swaggerDefinition,
  // Glob patterns pointing to files containing JSDoc API annotations
  apis: ["./src/modules/**/*.routes.js", "./src/routes/index.js"],
};

// ==========================================
// 3. Generate the OpenAPI Specification
// ==========================================
const swaggerSpec = swaggerJsdoc(options);

// ==========================================
// 4. Setup Function to Mount Swagger on Express App
// ==========================================
export function setupSwagger(app) {
  // Serve the interactive Swagger UI at /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Also expose the raw OpenAPI JSON at /api-docs.json (useful for code generation tools)
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerSpec;
