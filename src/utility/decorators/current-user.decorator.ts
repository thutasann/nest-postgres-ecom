import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom Decorator for Current loggedin User
 */
export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
