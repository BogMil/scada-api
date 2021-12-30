import { AuthServiceInterface } from '../auth.service';
import { getTokensStub } from '../test/stubs/tokens.stub';

export const AuthService = jest.fn().mockReturnValue({
  signupLocalAsync: jest.fn().mockResolvedValue(getTokensStub()),
  signinLocalAsync: jest.fn().mockResolvedValue(getTokensStub()),
  logoutAsync: jest.fn().mockResolvedValue(undefined),
  refreshTokensAsync: jest.fn().mockResolvedValue(getTokensStub()),
} as AuthServiceInterface);
