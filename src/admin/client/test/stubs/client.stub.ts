import { ClientDto, ClientRDto, ClientUdto } from '../../dto/client.dto';

export const getClientRdtoStub = () => {
  return {
    name: 'client name',
    id: 1,
    apiKey: 'api-key',
  } as ClientRDto;
};

export const getClientCdtoStub = () => {
  return {
    name: 'client name',
  } as ClientDto;
};
