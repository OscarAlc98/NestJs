import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = (user as any).toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: (user as any)._id,
      roles: user.roles,
      type: 'access',
    };
    const refreshPayload = {
      username: user.username,
      sub: (user as any)._id,
      roles: user.roles,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    // Guarda el refreshToken en BD o en propiedad del usuario (opcional, según tu lógica)
    await this.usersService.updateRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async register(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new ConflictException('El nombre de usuario ya existe');
    }
    await this.usersService.create({
      username,
      email,
      password,
      roles: ['ROLE_USER'],
    });
    return { message: 'Usuario registrado exitosamente' };
  }

  async refreshToken(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user || user.refreshToken !== rt) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    const payload = {
      username: user.username,
      sub: (user as any)._id,
      roles: user.roles,
      type: 'access',
    };
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { accessToken: newAccessToken };
  }

  async logout(userId: string) {
    return this.usersService.removeRefreshToken(userId);
  }
}
