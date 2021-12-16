import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, JwtPayloadWithRt } from '../types';
import { ConfigService } from '@nestjs/config';
declare const RtStrategy_base: new (...args: any[]) => Strategy;
export declare class RtStrategy extends RtStrategy_base {
    constructor(config: ConfigService);
    validate(req: Request, payload: JwtPayload): JwtPayloadWithRt;
}
export {};
