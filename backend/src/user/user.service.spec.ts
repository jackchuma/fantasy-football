import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create user', () => {
    it('Should save user to db and return val', async () => {
      const body = {
        email: 'test@email.com',
        password: 'pw',
        firstName: 'bill',
        lastName: 'brady',
      };
      const hashedPassword = 'hashed-pw';

      const user = new User();
      user.email = body.email;
      user.password_hash = hashedPassword;
      user.first_name = body.firstName;
      user.last_name = body.lastName;
      user.password_changed_at = expect.any(Date);

      mockUserRepository.save = jest.fn();

      expect(await service.createUser(body, hashedPassword)).toStrictEqual(
        user,
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('Get User by email', () => {
    it('Should query db based on email', async () => {
      const email = 'test@email.com';

      mockUserRepository.findOneBy = jest.fn();

      await service.getUserByEmail(email);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('Should return db response', async () => {
      const email = 'test@email.com';
      const user = { id: 'userId' };

      mockUserRepository.findOneBy = jest.fn().mockResolvedValue(user);

      expect(await service.getUserByEmail(email)).toStrictEqual(user);
    });

    it('Should catch db error and throw internal server error', async () => {
      const email = 'test@email.com';

      mockUserRepository.findOneBy = jest.fn().mockRejectedValue('error');

      try {
        await service.getUserByEmail(email);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('Internal Server Error');
      }
    });
  });
});
