import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types';

export function assertTokensValidity(tokens: Tokens) {
  const jwtService = new JwtService({});
  const at = jwtService.verify(tokens.access_token, {
    secret: process.env.AT_SECRET,
  });
  const rt = jwtService.verify(tokens.refresh_token, {
    secret: process.env.RT_SECRET,
  });

  expect(at.hasOwnProperty('exp')).toEqual(true);
  expect(at.hasOwnProperty('iat')).toEqual(true);
  expect(rt.hasOwnProperty('exp')).toEqual(true);
  expect(rt.hasOwnProperty('iat')).toEqual(true);
}
