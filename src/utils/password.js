import argon2 from "argon2";

export async function hashPassword(plainPassword) {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
  });
}

export async function verifyPassword(hash, plainPassword) {
  return argon2.verify(hash, plainPassword);
}
