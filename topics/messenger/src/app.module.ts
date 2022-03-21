import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { SearchModule } from './search/search.module';
import { ShortLinkModule } from './short-link/short-link.module';
import ormconfig from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    AuthModule,
    ChatModule,
    SearchModule,
    ShortLinkModule,
  ],
})
export class AppModule {}
