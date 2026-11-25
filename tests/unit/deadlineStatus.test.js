import { describe, it, expect } from "@jest/globals";
import {
  statusForDeadline,
  todayString,
  CLOSING_SOON_DAYS,
} from "../../src/utils/deadlineStatus.js";

const TODAY = "2026-10-10";

describe("todayString", () => {
  it("returns the UTC date as YYYY-MM-DD", () => {
    expect(todayString(new Date("2026-10-10T23:30:00Z"))).toBe("2026-10-10");
  });
});

describe("statusForDeadline", () => {
  it("uses a 7-day closing-soon window", () => {
    expect(CLOSING_SOON_DAYS).toBe(7);
  });

  it("leaves opportunities without a deadline alone", () => {
    expect(statusForDeadline(null, "ACTIVE", TODAY)).toBeNull();
  });

  it("marks a deadline in the past as EXPIRED", () => {
    expect(statusForDeadline("2026-10-09", "ACTIVE", TODAY)).toBe("EXPIRED");
    expect(statusForDeadline("2026-01-01", "CLOSING_SOON", TODAY)).toBe(
      "EXPIRED",
    );
  });

  it("treats a deadline today as CLOSING_SOON", () => {
    expect(statusForDeadline(TODAY, "ACTIVE", TODAY)).toBe("CLOSING_SOON");
  });

  it("marks deadlines within 7 days as CLOSING_SOON, including exactly 7", () => {
    expect(statusForDeadline("2026-10-11", "ACTIVE", TODAY)).toBe(
      "CLOSING_SOON",
    );
    expect(statusForDeadline("2026-10-17", "ACTIVE", TODAY)).toBe(
      "CLOSING_SOON",
    );
  });

  it("marks deadlines more than 7 days away as ACTIVE", () => {
    expect(statusForDeadline("2026-10-18", "CLOSING_SOON", TODAY)).toBe(
      "ACTIVE",
    );
  });

  it("reopens an EXPIRED opportunity if its deadline was moved into the future", () => {
    expect(statusForDeadline("2026-12-01", "EXPIRED", TODAY)).toBe("ACTIVE");
  });

  it("returns null when the status is already correct", () => {
    expect(statusForDeadline("2026-12-01", "ACTIVE", TODAY)).toBeNull();
    expect(statusForDeadline("2026-10-12", "CLOSING_SOON", TODAY)).toBeNull();
    expect(statusForDeadline("2026-09-01", "EXPIRED", TODAY)).toBeNull();
  });

  it("never changes CLOSED or UNDER_REVIEW opportunities", () => {
    expect(statusForDeadline("2026-09-01", "CLOSED", TODAY)).toBeNull();
    expect(statusForDeadline("2026-09-01", "UNDER_REVIEW", TODAY)).toBeNull();
  });
});
