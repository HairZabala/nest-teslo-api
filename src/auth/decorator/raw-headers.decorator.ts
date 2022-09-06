import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeader = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();

  const rawHeaders = req.rawHeaders;

  if (!rawHeaders)
    throw new InternalServerErrorException('Raw headers not found (Request)');

  return rawHeaders;
});
