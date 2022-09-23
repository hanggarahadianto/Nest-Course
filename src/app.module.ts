import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { AccessControlModule } from 'nest-access-control';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { postgresDataSouce } from './config/typeorm-postgres';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { roles } from './modules/user/user.roles.models';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(postgresDataSouce.options),
    MulterModule.register({
      storage: memoryStorage,
    }),
    PassportModule.register({
      session: true,
    }),
    CategoryModule,
    PostModule,
    UserModule,
    AuthModule,
    AccessControlModule.forRoles(roles),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
