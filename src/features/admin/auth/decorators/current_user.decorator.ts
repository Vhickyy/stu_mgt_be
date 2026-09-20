import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AdminJwtPayload {
  sub: string;
}

export const CurrentAdmin = createParamDecorator(
  (data: keyof AdminJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const admin = request.user as AdminJwtPayload;
    return data ? admin?.[data] : admin;
  },
);
