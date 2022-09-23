import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: UserService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload: any) {
    let user = await this.userRepo.getUserId(payload.id);
    return user;
  }
}
