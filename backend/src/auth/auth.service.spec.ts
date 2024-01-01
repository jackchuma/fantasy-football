import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: any;
  let mockConfigService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserService = {};
    mockConfigService = {};
    mockJwtService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Register User', () => {
    it('Should throw if body missing email', async () => {
      const body: any = {
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response' };

      try {
        await service.registerUser(body, res);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('Invalid request body');
      }
    });

    it('Should throw if body missing password', async () => {
      const body: any = {
        email: 'test@email.com',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response' };

      try {
        await service.registerUser(body, res);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('Invalid request body');
      }
    });

    it('Should throw if body missing first name', async () => {
      const body: any = {
        email: 'test@email.com',
        password: 'pw',
        lastName: 'lastname',
      };
      const res: any = { type: 'response' };

      try {
        await service.registerUser(body, res);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('Invalid request body');
      }
    });

    it('Should throw if body missing last name', async () => {
      const body: any = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
      };
      const res: any = { type: 'response' };

      try {
        await service.registerUser(body, res);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('Invalid request body');
      }
    });

    it('Should get user by email', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn();

      await service.registerUser(body, res);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(body.email);
    });

    it('Should throw if user exists', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };

      mockUserService.getUserByEmail = jest.fn().mockResolvedValue(user);
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn();

      try {
        await service.registerUser(body, res);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('A user with that email already exists');
      }
    });

    it('Should gen salt to hash password', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn();
      bcrypt.genSalt = jest.fn();

      await service.registerUser(body, res);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    });

    it('Should hash password', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn();
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn();

      await service.registerUser(body, res);
      expect(bcrypt.hash).toHaveBeenCalledWith(body.password, 'salt');
    });

    it('Should create user', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn();
      bcrypt.hash = jest.fn().mockResolvedValue('hashed-pw');

      await service.registerUser(body, res);
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        body,
        'hashed-pw',
      );
    });

    it('Should get jwt token to use for cookie', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn();
      bcrypt.hash = jest.fn().mockResolvedValue('hashed-pw');

      await service.registerUser(body, res);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { id: 'userId' },
        {
          secret: 'secret',
          expiresIn: '10h',
        },
      );
    });

    it('Should set cookie', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId' };
      const token = 'jwt-token';

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn().mockResolvedValue(token);
      bcrypt.hash = jest.fn().mockResolvedValue('hashed-pw');

      await service.registerUser(body, res);
      expect(res.cookie).toHaveBeenCalledWith('cookie', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    });

    it('Should remove user password hash', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId', password_hash: 'hashed-pw' };
      const token = 'jwt-token';

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn().mockResolvedValue(token);
      bcrypt.hash = jest.fn().mockResolvedValue('hashed-pw');

      const resp = await service.registerUser(body, res);
      expect(resp.data.user.password_hash).toBe(undefined);
    });

    it('Should return success', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'name',
        lastName: 'lastname',
      };
      const res: any = { type: 'response', cookie: jest.fn() };
      const user: any = { ...body, id: 'userId', password_hash: 'hashed-pw' };
      const token = 'jwt-token';

      mockUserService.getUserByEmail = jest.fn();
      mockConfigService.getOrThrow = jest.fn().mockImplementation((i) => {
        const config = {
          salt: 10,
          secret: 'secret',
          cookieName: 'cookie',
        };
        return config[i];
      });
      mockUserService.createUser = jest.fn().mockResolvedValue(user);
      mockJwtService.signAsync = jest.fn().mockResolvedValue(token);
      bcrypt.hash = jest.fn().mockResolvedValue('hashed-pw');

      const resp = await service.registerUser(body, res);
      delete user.password_hash;

      expect(resp).toStrictEqual({ success: true, data: { user } });
    });
  });
});
