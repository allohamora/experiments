import { applyDecorators, UseGuards } from '@nestjs/common';
import { IdGuard } from './id.guard';

export const Auth = () => applyDecorators(UseGuards(IdGuard));
