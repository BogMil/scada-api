import { JwtPayload } from 'src/auth/types';

export const jwtPayloadStub = (): JwtPayload => ({
  email: 'asd@gmail',
  sub: 123,
});
