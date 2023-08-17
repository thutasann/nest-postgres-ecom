import { SetMetadata } from '@nestjs/common';

/**
 * Authorize Roles custom Decoration
 * @param {string[]} roles - Roles (Admin and User)
 */
export const AuthorizeRoles = (...roles: string[]) =>
  SetMetadata('allowedRoles', roles);
