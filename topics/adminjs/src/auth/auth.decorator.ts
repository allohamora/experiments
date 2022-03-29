import { applyDecorators, UseGuards } from '@nestjs/common';
import { LoginGuard } from './login.guard';

export const Auth = () => applyDecorators(UseGuards(LoginGuard));
