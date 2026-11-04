import { randomUUID } from "node:crypto";
import request from "supertest";
import app from "../../src/app.js";
import {
  sequelize,
  User,
  Opportunity,
  SavedOpportunity,
} from "../../src/database/models/index.js";

let accessToken;
let userIds = [];
let opportunityIds = [];

async function registerUser() {
  const response = await request(app).post("/api/v1/auth/register").send({
    firstName: "Saved",
    lastName: "Test",
    email: `saved-${randomUUID()}@rovia.app`,
    password: "SecurePass123!",
  });

  expect(response.status).toBe(201);
  userIds.push(response.body.data.user.id);
  return response.body.data;
}

async function createOpportunity(title) {
  const response = await request(app)
    .post("/api/v1/opportunities/bring")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title,
      organisation: "Saved Test Org",
      type: "JOB",
    });

  expect([200, 201]).toContain(response.status);
  const id = response.body.data.opportunity?.id || response.body.data.id;
  opportunityIds.push(id);
  return id;
}

beforeAll(async () => {
  await sequelize.authenticate();
});

beforeEach(async () => {
  userIds = [];
  opportunityIds = [];
  const user = await registerUser();
  accessToken = user.accessToken;
});

afterEach(async () => {
  if (userIds.length > 0) {
    await SavedOpportunity.destroy({ where: { userId: userIds } });
  }
  if (opportunityIds.length > 0) {
    await Opportunity.destroy({ where: { id: opportunityIds } });
  }
  if (userIds.length > 0) {
    await User.destroy({ where: { id: userIds } });
  }
  accessToken = undefined;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Saved opportunities list", () => {
  it("requires authentication", async () => {
    const response = await request(app).get("/api/v1/opportunities/saved");

    expect(response.status).toBe(401);
  });

  it("returns an empty list for a user with no saved opportunities", async () => {
    const response = await request(app)
      .get("/api/v1/opportunities/saved")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.savedOpportunities).toEqual([]);
    expect(response.body.data.pagination.totalItems).toBe(0);
  });

  it("lists the opportunities the user saved, most recent first", async () => {
    const firstId = await createOpportunity("First saved role");
    const secondId = await createOpportunity("Second saved role");

    await request(app)
      .post(`/api/v1/opportunities/${firstId}/save`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    await request(app)
      .post(`/api/v1/opportunities/${secondId}/save`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const response = await request(app)
      .get("/api/v1/opportunities/saved")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    const { savedOpportunities, pagination } = response.body.data;
    expect(pagination.totalItems).toBe(2);
    expect(savedOpportunities).toHaveLength(2);
    expect(savedOpportunities[0].opportunity.id).toBe(secondId);
    expect(savedOpportunities[1].opportunity.id).toBe(firstId);
    expect(savedOpportunities[0].savedAt).toBeDefined();
  });

  it("does not show another user's saved opportunities", async () => {
    const opportunityId = await createOpportunity("Private save");

    await request(app)
      .post(`/api/v1/opportunities/${opportunityId}/save`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    const other = await registerUser();
    const response = await request(app)
      .get("/api/v1/opportunities/saved")
      .set("Authorization", `Bearer ${other.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.savedOpportunities).toEqual([]);
  });

  it("rejects an invalid limit", async () => {
    const response = await request(app)
      .get("/api/v1/opportunities/saved?limit=500")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
