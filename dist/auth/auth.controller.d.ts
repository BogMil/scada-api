import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    signupLocal(dto: AuthDto): Promise<Tokens>;
    signinLocal(dto: AuthDto): Promise<Tokens>;
    logout(userId: number): void;
    refreshTokens(userId: number, refreshToken: string): Promise<Tokens>;
    test(): any;
}
