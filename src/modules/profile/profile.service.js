import {
  Profile,
  User,
  Education,
  Skill,
} from "../../database/models/index.js";
import ApiError from "../../utils/ApiError.js";

export async function getProfileByUserId(userId) {
  const profile = await Profile.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "id",
          "email",
          "accountStatus",
          "emailVerified",
          "createdAt",
        ],
      },
    ],
  });

  if (!profile) {
    throw new ApiError(404, "NOT_FOUND", "Profile not found");
  }

  const education = await Education.findAll({
    where: { userId },
    order: [["startDate", "DESC"]],
  });

  const userWithSkills = await User.findByPk(userId, {
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

  return {
    profile,
    education: education || [],
    skills: userWithSkills?.skills || [],
  };
}

export async function updateProfile(userId, updateData) {
  const profile = await Profile.findOne({ where: { userId } });

  if (!profile) {
    throw new ApiError(404, "NOT_FOUND", "Profile not found");
  }

  const allowedFields = [
    "headline",
    "location",
    "country",
    "careerLevel",
    "biography",
  ];
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      profile[field] = updateData[field];
    }
  }

  // Check that all 5 fields have actual non-empty content
  const hasHeadline = Boolean(profile.headline?.trim());
  const hasLocation = Boolean(profile.location?.trim());
  const hasCountry = Boolean(profile.country?.trim());
  const hasCareerLevel = Boolean(profile.careerLevel);
  const hasBiography = Boolean(profile.biography?.trim());

  const isComplete =
    hasHeadline && hasLocation && hasCountry && hasCareerLevel && hasBiography;

  profile.completionStatus = isComplete ? "COMPLETE" : "INCOMPLETE";

  await profile.save();

  return profile;
}
