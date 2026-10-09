"use strict";

const crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const defaultSkills = [
      { name: "JavaScript", category: "Frontend/Backend" },
      { name: "TypeScript", category: "Frontend/Backend" },
      { name: "Node.js", category: "Backend" },
      { name: "Express.js", category: "Backend" },
      { name: "Python", category: "Backend/Data" },
      { name: "Django", category: "Backend" },
      { name: "React", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "MySQL", category: "Database" },
      { name: "MongoDB", category: "Database" },
      { name: "Redis", category: "Database/Caching" },
      { name: "Docker", category: "DevOps" },
      { name: "Kubernetes", category: "DevOps" },
      { name: "AWS", category: "Cloud" },
      { name: "Git & GitHub", category: "Tools" },
      { name: "RESTful API Design", category: "Architecture" },
      { name: "GraphQL", category: "Architecture" },
      { name: "Cybersecurity Fundamentals", category: "Security" },
      { name: "Agile/Scrum", category: "Methodology" },
    ];

    const rows = defaultSkills.map((skill) => ({
      id: crypto.randomUUID(),
      name: skill.name,
      category: skill.category,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert only if not already present (idempotent seed)
    await queryInterface.bulkInsert("skills", rows, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("skills", null, {});
  },
};
