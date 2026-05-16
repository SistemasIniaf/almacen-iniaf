import { SetMetadata } from '@nestjs/common';
import { Rol } from '../enums/rol.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorador para proteger endpoints por rol.
 * @example @Roles(Rol.ADMINISTRADOR, Rol.AUDITOR)
 */
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);
