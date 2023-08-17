import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Authorization Guard to check the currentUser is ADMIN or USER
 */
export const AuthorizationGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.roles
        ?.map((role: string) => allowedRoles.includes(role))
        .find((val: boolean) => val === true);

      if (result) return true;

      throw new UnauthorizedException('You are not Authorized!');
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};
