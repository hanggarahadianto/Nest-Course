import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { SessionGuard } from './session.guard';
import { CookieSerializer } from './serializeUser';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '1d',
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionGuard,
    CookieSerializer,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
