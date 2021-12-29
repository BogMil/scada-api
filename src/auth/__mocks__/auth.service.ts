import { AuthServiceInterface } from '../auth.service';
import { authDtoStub } from '../test/stubs/authDto.stub';
import { tokensStub } from '../test/stubs/tokens.stub';

export const AuthService = jest.fn().mockReturnValue({
  signupLocalAsync: jest.fn().mockResolvedValue(tokensStub()),
  signinLocalAsync: jest.fn().mockResolvedValue(tokensStub()),
  logoutAsync: jest.fn().mockResolvedValue(undefined),
  refreshTokensAsync: jest.fn().mockResolvedValue(tokensStub()),
} as AuthServiceInterface);
