import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { LoginStrategy } from './strategy/login.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [LoginStrategy],
})
export class AuthModule {}
