import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import ormconfig from 'ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
