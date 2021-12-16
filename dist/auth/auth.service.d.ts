import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    signupLocal(dto: AuthDto): Promise<Tokens>;
    signinLocal(dto: AuthDto): Promise<Tokens>;
    logout(userId: number): Promise<void>;
    refreshTokens(userId: number, rt: string): Promise<Tokens>;
    private getTokensAndAddStoreRefreshToken;
    private getTokens;
    addNewRtToUser(userId: number, rt: string): Promise<void>;
    hashData(password: string): Promise<string>;
}
