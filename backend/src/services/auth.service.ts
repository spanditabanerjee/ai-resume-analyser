import { userRepository } from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
  getAccessTokenExpiresInSeconds,
} from "../utils/jwt";
import { AppError } from "../middleware/error.middleware";
import type { RegisterInput, LoginInput } from "../validators/auth.schema";

function toPublicUser(user: {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

async function issueTokens(user: { id: string; email: string }) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  await userRepository.createRefreshToken({
    userId: user.id,
    tokenHash,
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: getAccessTokenExpiresInSeconds(),
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "EMAIL_EXISTS", "Email is already registered");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    const tokens = await issueTokens(user);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const tokens = await issueTokens(user);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },

  async refresh(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const stored = await userRepository.findRefreshToken(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid or expired refresh token");
    }

    await userRepository.revokeRefreshToken(tokenHash);

    const tokens = await issueTokens(stored.user);

    return tokens;
  },

  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const stored = await userRepository.findRefreshToken(tokenHash);

    if (stored && !stored.revokedAt) {
      await userRepository.revokeRefreshToken(tokenHash);
    }
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }
    return user;
  },
};
