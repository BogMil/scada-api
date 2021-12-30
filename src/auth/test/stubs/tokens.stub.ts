import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/auth/types';
import { AT_DURATION, RT_DURATION } from 'src/common/constants';
require('dotenv').config({ debug: process.env.DEBUG });

export const getTokensStub = async (): Promise<Tokens> => {
  const jwtService = new JwtService({});
  const at = await jwtService.sign(
    {},
    {
      expiresIn: AT_DURATION,
      secret: process.env.AT_SECRET,
    },
  );

  const rt = jwtService.sign(
    {},
    {
      expiresIn: RT_DURATION,
      secret: process.env.RT_SECRET,
    },
  );
  return {
    access_token: at,
    refresh_token: rt,
  };
};
