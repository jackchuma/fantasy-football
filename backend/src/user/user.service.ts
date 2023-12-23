import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(body: CreateUserDto, hashedPassword: string): Promise<User> {
    const user = new User();
    user.email = body.email;
    user.password_hash = hashedPassword;
    user.first_name = body.firstName;
    user.last_name = body.lastName;
    user.password_changed_at = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (e) {
      this.logger.error('getUserByEmail error', e);
      throw new InternalServerErrorException();
    }
  }
}
