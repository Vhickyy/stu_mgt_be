import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface StudentJwtPayload {
  sub: string;
}

export const CurrentStudent = createParamDecorator(
  (data: keyof StudentJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const student = request.user as StudentJwtPayload;
    return data ? student?.[data] : student;
  },
);
