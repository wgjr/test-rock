import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    const data = await this.authService.register(payload);

    return {
      success: true,
      message: 'User registered successfully',
      data,
    };
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    const data = await this.authService.login(payload);

    return {
      success: true,
      message: 'Login successful',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() _user: AuthenticatedUser) {
    return this.authService.logout();
  }
}
