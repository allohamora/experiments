import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IdStrategy } from './strategy/id.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, IdStrategy],
})
export class AuthModule {}
