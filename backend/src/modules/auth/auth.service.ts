
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service.js';
import { User } from '../users/entities/user.entity.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private publicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private async createAuthResponse(
    user: User,
  ): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      user: this.publicUser(user),
    };
  }

  async register(
    dto: RegisterDto,
  ): Promise<AuthResponse> {
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return this.createAuthResponse(user);
  }

  async login(
    dto: LoginDto,
  ): Promise<AuthResponse> {
    const user =
      await this.usersService.findByEmailWithPassword(
        dto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Credenciais inválidas',
      );
    }

    const validPassword = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException(
        'Credenciais inválidas',
      );
    }

    return this.createAuthResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado',
      );
    }

    return this.publicUser(user);
  }
}
