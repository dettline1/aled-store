import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@aled/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
