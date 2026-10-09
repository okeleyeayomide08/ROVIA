"use strict";

const crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const defaultInterests = [
      {
        name: "Artificial Intelligence & Machine Learning",
        category: "Emerging Tech",
      },
      { name: "Cloud & Distributed Systems", category: "Architecture" },
      { name: "Fintech & Digital Payments", category: "Industry" },
      { name: "HealthTech", category: "Industry" },
      { name: "EdTech & Online Learning", category: "Industry" },
      { name: "Cybersecurity & Ethical Hacking", category: "Security" },
      { name: "Web3 & Blockchain", category: "Emerging Tech" },
      { name: "Open Source Contribution", category: "Community" },
      { name: "DevOps & Site Reliability", category: "Operations" },
      { name: "Technical Writing & Mentorship", category: "Career Growth" },
    ];

    const rows = defaultInterests.map((interest) => ({
      id: crypto.randomUUID(),
      name: interest.name,
      category: interest.category,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("interests", rows, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("interests", null, {});
  },
};
