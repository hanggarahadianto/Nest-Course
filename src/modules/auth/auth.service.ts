import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateDtoAuth } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private userRepo: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new HttpException('Email not found', HttpStatus.NOT_FOUND);

    const valid = this.userRepo.compare(password, user.password);
    if (!valid) {
      throw new HttpException('Wrong Password', HttpStatus.BAD_REQUEST);
    }
    // delete user.password;
    return user;
  }

  generateToken(user: any) {
    let tokenData = { id: user.id };
    let token = this.jwtService.sign(tokenData);
    return { token: token };
  }
}
