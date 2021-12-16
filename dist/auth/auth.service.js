"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bycipt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("../common/constants");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async signupLocal(dto) {
        const hash = await this.hashData(dto.password);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });
        return this.getTokensAndAddStoreRefreshToken(newUser);
    }
    async signinLocal(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.ForbiddenException('Access Denied');
        const passwordMatches = bycipt.compare(dto.password, user.hash);
        if (!passwordMatches)
            throw new common_1.ForbiddenException('Access Denied');
        return this.getTokensAndAddStoreRefreshToken(user);
    }
    async logout(userId) {
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
    async refreshTokens(userId, rt) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isLoggedOut)
            throw new common_1.ForbiddenException('Access Denied');
        return this.getTokensAndAddStoreRefreshToken(user);
    }
    async getTokensAndAddStoreRefreshToken(user) {
        const tokens = await this.getTokens(user);
        this.addNewRtToUser(user.id, tokens.refresh_token);
        return tokens;
    }
    async getTokens(user) {
        const jwtPayload = { sub: user.id, email: user.email };
        const [at, rt] = await Promise.all([
            this.jwtService.sign(jwtPayload, {
                expiresIn: constants_1.AT_DURATION,
                secret: this.config.get('AT_SECRET'),
            }),
            this.jwtService.sign(jwtPayload, {
                expiresIn: constants_1.RT_DURATION,
                secret: this.config.get('RT_SECRET'),
            }),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    }
    async addNewRtToUser(userId, rt) {
        await this.prisma.refreshToken.create({
            data: {
                userId: userId,
                value: rt,
            },
        });
    }
    hashData(password) {
        return bycipt.hash(password, 10);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map