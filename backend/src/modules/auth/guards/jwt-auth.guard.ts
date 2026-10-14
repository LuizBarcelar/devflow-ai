
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { UsersService } from '../../users/users.service.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Token não informado',
      );
    }

    const [scheme, token, extra] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token || extra) {
      throw new UnauthorizedException(
        'Formato de autorização inválido',
      );
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<{
          sub: string;
        }>(token);

      if (
        !payload ||
        typeof payload.sub !== 'string'
      ) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findById(
        payload.sub,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      request.user = {
        id: user.id,
      };

      return true;
    } catch {
      throw new UnauthorizedException(
        'Token inválido ou expirado',
      );
    }
  }
}
