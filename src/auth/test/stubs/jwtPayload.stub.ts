import { JwtPayload } from 'src/auth/types';

export const getJwtPayloadStub = (): JwtPayload => ({
  email: 'asd@gmail',
  sub: 123,
});
