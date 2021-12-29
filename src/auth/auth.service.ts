import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bycript from 'bcrypt';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { AT_DURATION, RT_DURATION } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/generated/client';

export interface AuthServiceInterface {
  signupLocalAsync: (dto: AuthDto) => Promise<Tokens>;
  signinLocalAsync: (dto: AuthDto) => Promise<Tokens>;
  logoutAsync: (userId: number) => Promise<void>;
  refreshTokensAsync: (userId: number) => Promise<Tokens>;
}
@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  public async signupLocalAsync(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    await this.setIsUserloggedOut(newUser.id, false);
    return this.getTokensAndAddStoreRefreshToken(newUser);
  }

  async signinLocalAsync(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = bycript.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    await this.setIsUserloggedOut(user.id, false);
    return this.getTokensAndAddStoreRefreshToken(user);
  }

  async logoutAsync(userId: number) {
    await this.setIsUserloggedOut(userId, true);
  }

  private setIsUserloggedOut = async (userId: number, value: boolean) => {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        isLoggedOut: value,
      },
    });
  };

  async refreshTokensAsync(userId: number): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isLoggedOut)
      throw new ForbiddenException('Access Denied');

    return this.getTokensAndAddStoreRefreshToken(user);
  }

  private async getTokensAndAddStoreRefreshToken(user: User): Promise<Tokens> {
    const tokens = await this.getTokens(user);
    this.addNewRtToUser(user.id, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = { sub: user.id, email: user.email };
    const [at, rt] = await Promise.all([
      this.jwtService.sign(jwtPayload, {
        expiresIn: AT_DURATION,
        secret: this.config.get<string>('AT_SECRET'),
      }),
      this.jwtService.sign(jwtPayload, {
        expiresIn: RT_DURATION,
        secret: this.config.get<string>('RT_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async addNewRtToUser(userId: number, rt: string) {
    await this.prisma.refreshToken.create({
      data: {
        userId: userId,
        value: rt,
      },
    });
  }

  hashData(password: string) {
    return bycript.hash(password, 10);
  }
}
