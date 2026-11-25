import { Op } from "sequelize";
import { Opportunity } from "../../database/models/index.js";
import logger from "../../config/logger.js";
import { statusForDeadline, todayString } from "../../utils/deadlineStatus.js";

/**
 * Bring every opportunity's status in line with its deadline.
 * Called by the daily cron job and once when the server starts.
 * Returns the number of opportunities whose status changed.
 */
export async function syncOpportunityStatuses(now = new Date()) {
  const today = todayString(now);

  const opportunities = await Opportunity.findAll({
    where: {
      deadline: { [Op.ne]: null },
      status: { [Op.in]: ["ACTIVE", "CLOSING_SOON", "EXPIRED"] },
    },
    attributes: ["id", "deadline", "status"],
  });

  // Group ids by their new status so each status is written in one query.
  const idsByStatus = new Map();
  for (const opp of opportunities) {
    const target = statusForDeadline(opp.deadline, opp.status, today);
    if (!target) continue;
    if (!idsByStatus.has(target)) idsByStatus.set(target, []);
    idsByStatus.get(target).push(opp.id);
  }

  let changed = 0;
  for (const [status, ids] of idsByStatus) {
    await Opportunity.update({ status }, { where: { id: { [Op.in]: ids } } });
    changed += ids.length;
  }

  logger.info(
    { checked: opportunities.length, changed },
    "Opportunity statuses synced with deadlines",
  );
  return changed;
}
