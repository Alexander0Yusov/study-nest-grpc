export interface AccessTokenPayload {
  sub: number;
  sid: number;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: number;
  sid: number;
  type: 'refresh';
  version: number;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}
