import {
  sequelize,
  Skill,
  User,
  UserSkill,
} from "../../database/models/index.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Get all available skills from the master catalog
 */
export async function getAllSkills(searchQuery) {
  const where = {};

  if (searchQuery) {
    const { Op } = await import("sequelize");
    where.name = {
      [Op.iLike]: `%${searchQuery}%`,
    };
  }

  return Skill.findAll({
    where,
    order: [["name", "ASC"]],
  });
}

/**
 * Get skills for the authenticated user (through join table)
 */
export async function getUserSkills(userId) {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Skill,
        as: "skills",
        through: {
          attributes: ["proficiency", "evidence"],
        },
      },
    ],
  });

  return user?.skills || [];
}

/**
 * Add a skill to user profile (creates master skill if it doesn't exist)
 */
export async function addUserSkill(userId, data) {
  const trimmedName = data.name.trim();

  return sequelize.transaction(async (t) => {
    // Find or create the skill in the master catalog
    const [skill] = await Skill.findOrCreate({
      where: { name: trimmedName },
      defaults: {
        name: trimmedName,
        category: data.category || null,
      },
      transaction: t,
    });

    // Check if user already has this skill
    const existing = await UserSkill.findOne({
      where: { userId, skillId: skill.id },
      transaction: t,
    });

    if (existing) {
      throw new ApiError(409, "CONFLICT", "You have already added this skill");
    }

    // Create the join table entry with proficiency and evidence
    await UserSkill.create(
      {
        userId,
        skillId: skill.id,
        proficiency: data.proficiency || "BEGINNER",
        evidence: data.evidence || null,
      },
      { transaction: t },
    );

    // Return the skill with join table data
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Skill,
          as: "skills",
          where: { id: skill.id },
          through: { attributes: ["proficiency", "evidence"] },
        },
      ],
      transaction: t,
    });

    return user?.skills?.[0] || skill;
  });
}

/**
 * Update proficiency/evidence for a user's skill
 */
export async function updateUserSkill(userId, skillId, updateData) {
  const userSkill = await UserSkill.findOne({
    where: { userId, skillId },
  });

  if (!userSkill) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Skill not associated with your profile",
    );
  }

  const allowedFields = ["proficiency", "evidence"];
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      userSkill[field] = updateData[field];
    }
  }

  await userSkill.save();

  // Return updated skill with join data
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Skill,
        as: "skills",
        where: { id: skillId },
        through: { attributes: ["proficiency", "evidence"] },
      },
    ],
  });

  return user?.skills?.[0] || null;
}

/**
 * Remove a skill from user profile
 */
export async function removeUserSkill(userId, skillId) {
  const deletedCount = await UserSkill.destroy({
    where: { userId, skillId },
  });

  if (!deletedCount) {
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Skill not associated with your profile",
    );
  }
}
