import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@kittu-cafe/shared';

export function requireRoles(...allowed: (UserRole | UserRole[])[]) {
  const flattened: UserRole[] = allowed.flat() as UserRole[];
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!flattened.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: ${flattened.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
}
