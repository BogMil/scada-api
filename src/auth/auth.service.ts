import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bycipt from 'bcrypt';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AT_DURATION, RT_DURATION } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  public async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    return this.getTokensAndAddStoreRefreshToken(newUser);
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = bycipt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    return this.getTokensAndAddStoreRefreshToken(user);
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        isLoggedOut: {
          equals: false,
        },
      },
      data: {
        isLoggedOut: true,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isLoggedOut)
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
    return bycipt.hash(password, 10);
  }
}
