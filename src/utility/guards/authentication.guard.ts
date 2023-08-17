import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Authentication Guard that checks there is currentUser or not
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
}
