import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new UnprocessableEntityException({
        message: 'The email has already been taken.',
        errors: {
          email: ['The email has already been taken.'],
        },
      });
    }

    const user = this.usersRepository.create({
      name: payload.name,
      email: payload.email,
      password: await hash(payload.password, 10),
      role: 'user',
    });

    const createdUser = await this.usersRepository.save(user);

    return this.createAuthResponse(createdUser);
  }

  async login(payload: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: payload.email })
      .getOne();

    if (!user || !(await compare(payload.password, user.password))) {
      throw new UnauthorizedException({
        message: 'These credentials do not match our records.',
        errors: {
          email: ['These credentials do not match our records.'],
        },
      });
    }

    return this.createAuthResponse(user);
  }

  async logout() {
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  private createAuthResponse(user: User) {
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      user: this.serializeUser(user),
      token,
    };
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
