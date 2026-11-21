import { jest } from "@jest/globals";

// Unit tests for the email sender. These mock the HTTP call to Brevo,
// so they do not need a database or a real email account.

const REQUIRED_ENV = {
  NODE_ENV: "test",
  PORT: "5000",
  DATABASE_URL: "postgres://unused:unused@localhost:5432/unused",
  JWT_ACCESS_SECRET: "unit-test-access-secret",
  JWT_REFRESH_SECRET: "unit-test-refresh-secret",
  JWT_ACCESS_EXPIRES_IN: "15m",
  JWT_REFRESH_EXPIRES_IN: "7d",
  BREVO_API_KEY: "test-brevo-key",
  EMAIL_FROM: "Rovia <noreply@example.com>",
};

let email;

beforeAll(async () => {
  Object.assign(process.env, REQUIRED_ENV);
  email = await import("../../src/utils/email.js");
});

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const okResponse = () => ({ ok: true, status: 201, json: async () => ({}) });

describe("sendVerificationEmail", () => {
  it("posts to Brevo with the API key, sender, recipient and link", async () => {
    global.fetch.mockResolvedValue(okResponse());

    await email.sendVerificationEmail({
      to: "ada@example.com",
      firstName: "Ada",
      verificationUrl: "https://app.example.com/verify-email?token=abc",
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(options.method).toBe("POST");
    expect(options.headers["api-key"]).toBe("test-brevo-key");

    const body = JSON.parse(options.body);
    expect(body.sender).toEqual({ name: "Rovia", email: "noreply@example.com" });
    expect(body.to).toEqual([{ email: "ada@example.com" }]);
    expect(body.subject).toBe("Verify Your Rovia Email Address");
    expect(body.htmlContent).toContain("https://app.example.com/verify-email?token=abc");
  });

  it("throws EmailDeliveryError when Brevo rejects the request", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ code: "unauthorized", message: "Key not found" }),
    });

    await expect(
      email.sendVerificationEmail({
        to: "ada@example.com",
        verificationUrl: "https://app.example.com/verify-email?token=abc",
      }),
    ).rejects.toThrow(email.EmailDeliveryError);
  });

  it("throws EmailDeliveryError when the network request fails", async () => {
    global.fetch.mockRejectedValue(new TypeError("fetch failed"));

    await expect(
      email.sendVerificationEmail({
        to: "ada@example.com",
        verificationUrl: "https://app.example.com/verify-email?token=abc",
      }),
    ).rejects.toThrow(email.EmailDeliveryError);
  });

  it("does not log the verification link", async () => {
    global.fetch.mockRejectedValue(new TypeError("fetch failed"));
    const logger = (await import("../../src/config/logger.js")).default;
    const spy = jest.spyOn(logger, "error");

    await expect(
      email.sendVerificationEmail({
        to: "ada@example.com",
        verificationUrl: "https://app.example.com/verify-email?token=SECRET123",
      }),
    ).rejects.toThrow();

    const logged = JSON.stringify(spy.mock.calls);
    expect(logged).not.toContain("SECRET123");
  });
});

describe("sendPasswordResetEmail", () => {
  it("sends the reset link to the recipient", async () => {
    global.fetch.mockResolvedValue(okResponse());

    await email.sendPasswordResetEmail({
      to: "ada@example.com",
      resetUrl: "https://app.example.com/reset-password?token=xyz",
    });

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.subject).toBe("Reset Your Rovia Password");
    expect(body.htmlContent).toContain("https://app.example.com/reset-password?token=xyz");
  });

  it("throws EmailDeliveryError on failure", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(
      email.sendPasswordResetEmail({
        to: "ada@example.com",
        resetUrl: "https://app.example.com/reset-password?token=xyz",
      }),
    ).rejects.toThrow(email.EmailDeliveryError);
  });
});

describe("sender parsing", () => {
  it("accepts a plain address as the sender", async () => {
    global.fetch.mockResolvedValue(okResponse());
    // env.js is read at import time, so update the cached value directly.
    const env = (await import("../../src/config/env.js")).default;
    const original = env.email.from;
    env.email.from = "noreply@example.com";

    try {
      await email.sendVerificationEmail({
        to: "ada@example.com",
        verificationUrl: "https://app.example.com/verify-email?token=abc",
      });
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.sender).toEqual({ name: "Rovia", email: "noreply@example.com" });
    } finally {
      env.email.from = original;
    }
  });
});
