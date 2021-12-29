import { ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types';
import { authDtoStub, jwtPayloadStub } from './stubs';

import { MockContext, Context, createMockContext } from '../../context';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bycript from 'bcrypt';
import { assertTokensValidity } from './common';

const createUser = async () => {
  const hash = await bycript.hash(authDtoStub().password, 10);
  return {
    id: 1,
    email: 'asd',
    hash,
    createdAt: new Date(),
    isLoggedOut: false,
    updatedAt: new Date(),
  };
};

describe('AuthService', () => {
  let mockCtx: MockContext;
  let ctx: Context;
  var jwtService = new JwtService({});
  var configService = new ConfigService();

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  describe('signupLocalAsync', () => {
    let tokens: Tokens;
    describe('signupLocalAsync valid call', () => {
      var createdUser;
      beforeEach(async () => {
        createdUser = await createUser();
        mockCtx.prisma.user.create.mockResolvedValue(createdUser);

        const authService = new AuthService(
          mockCtx.prisma as unknown as PrismaService,
          jwtService,
          configService,
        );

        jest
          .spyOn(authService, 'hashData')
          .mockImplementation((_) => createdUser.hash);

        tokens = await authService.signupLocalAsync(authDtoStub());

        jest.resetModules();
      });

      it('should call prisma.user.create', async () => {
        expect(ctx.prisma.user.create).toBeCalled();
      });

      it('should call prisma.user.create with correct data', async () => {
        expect(ctx.prisma.user.create).toBeCalledWith({
          data: {
            email: createdUser.email,
            hash: createdUser.hash,
          },
        });
      });

      it('should store refresh token', () => {
        expect(ctx.prisma.refreshToken.create).toBeCalled();
      });

      it('should store refresh token', () => {
        expect(ctx.prisma.refreshToken.create).toBeCalledWith({
          data: {
            userId: createdUser.id,
            value: tokens.refresh_token,
          },
        });
      });

      it('should store refresh token', () => {
        expect(ctx.prisma.refreshToken.create).toBeCalledWith({
          data: {
            userId: createdUser.id,
            value: tokens.refresh_token,
          },
        });
      });

      it('should return valid tokens', () => {
        assertTokensValidity(tokens);
      });
    });

    describe('signinLocalAsync', () => {
      var createdUser;
      beforeEach(async () => {
        createdUser = await createUser();
        mockCtx.prisma.user.findUnique.mockResolvedValue(createdUser);

        const authService = new AuthService(
          mockCtx.prisma as unknown as PrismaService,
          jwtService,
          configService,
        );

        jest
          .spyOn(authService, 'hashData')
          .mockImplementation((_) => createdUser.hash);

        tokens = await authService.signinLocalAsync(authDtoStub());

        jest.resetModules();
      });

      it('should call prisma.user.findUnique', async () => {
        expect(ctx.prisma.user.findUnique).toBeCalled();
      });

      it('should call prisma.user.findUnique with correct data', async () => {
        expect(ctx.prisma.user.findUnique).toBeCalledWith({
          where: { email: authDtoStub().email },
        });
      });

      it('should store refresh token', () => {
        expect(ctx.prisma.refreshToken.create).toBeCalled();
      });

      it('should store refresh token', () => {
        expect(ctx.prisma.refreshToken.create).toBeCalledWith({
          data: {
            userId: createdUser.id,
            value: tokens.refresh_token,
          },
        });
      });

      it('should return valid tokens', () => {
        assertTokensValidity(tokens);
      });
    });

    describe('logoutAsync', () => {
      beforeEach(async () => {
        const authService = new AuthService(
          mockCtx.prisma as unknown as PrismaService,
          jwtService,
          configService,
        );
        authService.logoutAsync((await createUser()).id);
        jest.resetModules();
      });

      it('should call prisma.user.updateMany', async () => {
        expect(ctx.prisma.user.updateMany).toBeCalled();
      });

      it('should call prisma.user.updateMany with correct data', async () => {
        expect(ctx.prisma.user.updateMany).toBeCalledWith({
          where: {
            id: (await createUser()).id,
          },
          data: { isLoggedOut: true },
        });
      });
    });

    describe('refreshTokensAsync', () => {
      describe('logged in', () => {
        var createdUser;
        beforeEach(async () => {
          createdUser = await createUser();
          mockCtx.prisma.user.findUnique.mockResolvedValue(createdUser);

          const authService = new AuthService(
            mockCtx.prisma as unknown as PrismaService,
            jwtService,
            configService,
          );
          authService.refreshTokensAsync(createdUser.id);
          jest.resetModules();
        });

        it('should return valid tokens', () => {
          assertTokensValidity(tokens);
        });
      });

      describe('logged out', () => {
        var createdUser;
        var authService;
        beforeEach(async () => {
          createdUser = await createUser();
          createdUser.isLoggedOut = true;
          mockCtx.prisma.user.findUnique.mockResolvedValue(createdUser);

          authService = new AuthService(
            mockCtx.prisma as unknown as PrismaService,
            jwtService,
            configService,
          );

          jest.resetModules();
        });

        it('should throw forbiden excetion', () => {
          expect(() =>
            authService.refreshTokensAsync(createdUser.id),
          ).rejects.toEqual(new ForbiddenException('Access Denied'));
        });
      });
    });
  });
});
