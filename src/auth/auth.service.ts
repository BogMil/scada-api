import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bycipt from 'bcrypt';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  public async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    return this.getTokensAndUpdateRtHash(newUser);
  }

  private async getTokensAndUpdateRtHash(user: User): Promise<Tokens> {
    const tokens = await this.getTokens(user);
    this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = { sub: user.id, email: user.email };
    const [at, rt] = await Promise.all([
      this.jwtService.sign(jwtPayload, {
        expiresIn: 60 * 15,
        secret: 'at-secret',
      }),
      this.jwtService.sign(jwtPayload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: 'rt-secret',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = bycipt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    return this.getTokensAndUpdateRtHash(user);
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bycipt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    return this.getTokensAndUpdateRtHash(user);
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRt: hash,
      },
    });
  }

  hashData(password: string) {
    return bycipt.hash(password, 10);
  }
}
