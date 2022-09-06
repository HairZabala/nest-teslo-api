import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();

  const user = req.user;

  if (!user) throw new InternalServerErrorException('User not found (Request)');

  if (data) {
    return user[data];
  }

  return user;
});
