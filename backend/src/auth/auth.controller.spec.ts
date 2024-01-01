import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Register User', () => {
    it('Should register user', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response' };

      mockAuthService.registerUser = jest.fn();

      await controller.registerUser(body, res);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(body, res);
    });

    it('Should return service response', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response' };
      const resp = { success: true };

      mockAuthService.registerUser = jest.fn().mockResolvedValue(resp);

      expect(await controller.registerUser(body, res)).toStrictEqual(resp);
    });
  });
});
