// Pure rules for turning an opportunity's deadline into its status.
// No database or environment access here, so these can be unit tested directly.

export const CLOSING_SOON_DAYS = 7;

// Statuses this job is allowed to change. CLOSED and UNDER_REVIEW are set by
// people, so the job leaves them alone.
const MANAGED_STATUSES = ["ACTIVE", "CLOSING_SOON", "EXPIRED"];

/**
 * Today's date as "YYYY-MM-DD" in UTC. Deadlines are date-only values,
 * so comparing date strings avoids time-of-day problems.
 */
export function todayString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/**
 * Whole days from `from` to `to`, both "YYYY-MM-DD". Negative if `to` is earlier.
 */
function daysBetween(from, to) {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/**
 * Work out the status an opportunity should have from its deadline.
 *
 * - deadline before today       -> EXPIRED
 * - deadline within 7 days      -> CLOSING_SOON (includes today)
 * - deadline further away       -> ACTIVE
 *
 * Returns the new status, or null when nothing should change.
 * Opportunities with no deadline, or with a status this job does not manage,
 * always return null.
 */
export function statusForDeadline(deadline, currentStatus, today) {
  if (!deadline) return null;
  if (!MANAGED_STATUSES.includes(currentStatus)) return null;

  const daysLeft = daysBetween(today, deadline);

  let target;
  if (daysLeft < 0) target = "EXPIRED";
  else if (daysLeft <= CLOSING_SOON_DAYS) target = "CLOSING_SOON";
  else target = "ACTIVE";

  return target === currentStatus ? null : target;
}
