import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ResType } from '../utils/resType';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(body: CreateUserDto, res: Response): Promise<ResType> {
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      throw new BadRequestException('Invalid request body');
    }

    const existingUser = await this.userService.getUserByEmail(body.email);

    if (existingUser) {
      throw new BadRequestException('A user with that email already exists');
    }

    const hashedPassword = await this.hash(body.password);

    const user = await this.userService.createUser(body, hashedPassword);

    await this.genCookie(user, res);

    return { success: true, data: { user } };
  }

  private async hash(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(
      this.configService.getOrThrow('salt'),
    );
    return await bcrypt.hash(password, salt);
  }

  private async genCookie(user: User, res: Response): Promise<void> {
    const token = await this.getJwtToken(user.id);
    res.cookie(this.configService.getOrThrow('cookieName'), token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    delete user.password_hash;
  }

  private async getJwtToken(id: string): Promise<string> {
    this.logger.log(`Creating JWT token for ${id}`);
    const payload = { id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('secret'),
      expiresIn: '10h',
    });
  }
}
