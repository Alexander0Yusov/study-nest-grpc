export interface RotateRefreshTokenInput {
  sessionId: number;
  userId: number;
  expectedVersion: number;
  refreshedAt: Date;
  expiresAt: Date;
}
