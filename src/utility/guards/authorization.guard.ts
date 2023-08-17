import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Authorization Guard to check the currentUser is ADMIN or USER
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    this.logger.debug('ALLOWED_ROLES 🚀', allowedRoles);

    const request = context.switchToHttp().getRequest();
    this.logger.debug('REQUEST => CURRENT_USER', request?.currentUser);

    const result = request?.currentUser?.roles
      ?.map((role: string) => allowedRoles.includes(role))
      .find((val: boolean) => val === true);

    if (result) return true;

    throw new UnauthorizedException('You are not Authorized!');
  }
}
