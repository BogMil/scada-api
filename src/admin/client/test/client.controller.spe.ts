// import { ExecutionContext, UseFilters } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { AtGuard, RtGuard } from '../../common/guards';
// import { ClientController } from '../client.controller';
// import { ClientService } from '../client.service';

// jest.mock('../auth.service.ts');

// describe('AuthController', () => {
//   let authController: ClientController;
//   let clientService: ClientService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [],
//       controllers: [ClientController],
//       providers: [ClientService],
//     })
//       .overrideGuard(RtGuard)
//       .useValue({
//         canActivate: (_: ExecutionContext) => {
//           return true;
//         },
//       })
//       .overrideGuard(AtGuard)
//       .useValue({
//         canActivate: (context: ExecutionContext) => {
//           const req = context.switchToHttp().getRequest();
//           // req.user = jwtPayloadStub();
//           return true;
//         },
//       })
//       .compile();

//     clientService = moduleRef.get<ClientService>(ClientService);
//     authController = moduleRef.get<ClientController>(ClientController);
//     jest.clearAllMocks();
//   });

//   describe('registerClient', () => {
//     describe('when signupLocal is called', () => {
//       // beforeEach(async () => {
//       //   tokens = await authController.signupLocal(authDtoStub());
//       // });
//     });
//   });
// });
