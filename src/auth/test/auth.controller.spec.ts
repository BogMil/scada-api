import { ExecutionContext, UseFilters } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AtGuard, RtGuard } from '../../common/guards';
import { Tokens } from '../types';
import { authDtoStub, jwtPayloadStub } from './stubs';
import { assertTokensValidity } from './common';

jest.mock('../auth.service.ts');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideGuard(RtGuard)
      .useValue({
        canActivate: (_: ExecutionContext) => {
          return true;
        },
      })
      .overrideGuard(AtGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = jwtPayloadStub();
          return true;
        },
      })
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('signupLocal', () => {
    describe('when signupLocal is called', () => {
      let tokens: Tokens;

      beforeEach(async () => {
        tokens = await authController.signupLocal(authDtoStub());
      });

      it('should call authService.signupLocalAsync', () => {
        expect(authService.signupLocalAsync).toBeCalled();
      });

      it('should call authService.signupLocalAsync with received dto', () => {
        expect(authService.signupLocalAsync).toBeCalledWith(authDtoStub());
      });

      it('should return valid tokens', () => {
        assertTokensValidity(tokens);
      });
    });
  });

  describe('signinLocal', () => {
    describe('when signinLocal is called', () => {
      let tokens;

      beforeEach(async () => {
        tokens = await authController.signinLocal(authDtoStub());
      });

      it('should call authService.signupLocalAsync', () => {
        expect(authService.signinLocalAsync).toBeCalled();
      });

      it('should call authService.signupLocalAsync with received dto', () => {
        expect(authService.signinLocalAsync).toBeCalledWith(authDtoStub());
      });

      it('should return valid tokens', () => {
        assertTokensValidity(tokens);
      });
    });
  });

  describe('refresh', () => {
    describe('when refresh is called', () => {
      let tokens;

      beforeEach(async () => {
        tokens = await authController.refreshTokens(jwtPayloadStub().sub);
      });

      it('should call authService.refreshTokensAsync', () => {
        expect(authService.refreshTokensAsync).toBeCalled();
      });

      it('should call authService.refreshTokensAsync with user id from jwtPayload', () => {
        expect(authService.refreshTokensAsync).toBeCalledWith(
          jwtPayloadStub().sub,
        );
      });

      it('should return valid tokens', () => {
        assertTokensValidity(tokens);
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let tokens;

      beforeEach(async () => {
        tokens = await authController.logout(jwtPayloadStub().sub);
      });

      it('should call authService.logoutAsync', () => {
        expect(authService.logoutAsync).toBeCalled();
      });

      it('should call authService.logoutAsync with user id from jwtPayload', () => {
        expect(authService.logoutAsync).toBeCalledWith(jwtPayloadStub().sub);
      });
    });
  });
});
