import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthUser } from '../common/decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.register(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req, @Res({ passthrough: true }) res) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user,
    );
    // Envía el refresh token en cookie HTTP-only
    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    return { accessToken, user };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@AuthUser() user, @Res({ passthrough: true }) res) {
    const { accessToken } = await this.authService.refreshToken(
      user.userId,
      user.refreshToken,
    );
    return { accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@AuthUser() user, @Res({ passthrough: true }) res) {
    await this.authService.logout(user.userId);
    res.clearCookie('Refresh', { path: '/' });
    return { message: 'Logged out successfully' };
  }
}
