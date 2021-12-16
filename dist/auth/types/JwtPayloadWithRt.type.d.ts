import { JwtPayload } from '.';
export declare type JwtPayloadWithRt = JwtPayload & {
    refreshToken: string;
};
