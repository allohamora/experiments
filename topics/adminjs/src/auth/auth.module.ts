import { Module } from '@nestjs/common';
import { UserModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { LoginStrategy } from './strategy/login.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [LoginStrategy],
})
export class AuthModule {}
