import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser } from '../user/user.decorator';
import { CreateDtoUser } from '../user/user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateDtoAuth } from './auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  // @Post('login')
  // async loginUser(@Body() loginData: any, @Res() res: Response) {
  //   const { token, user } = await this.authService.login(
  //     loginData as CreateDtoAuth,
  //   );

  //   res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
  //   res.cookie('Authentication', token, {
  //     httpOnly: true,
  //     maxAge: 2 * 60 * 60 * 1000,
  //   });

  //   return res.send({ success: true, user });
  // }

  // @Post('register')
  // register(@Body() userData: CreateDtoUser) {
  //   return this.authService.register(userData);
  // }
  @Post('register')
  registerUser(@Body() registerData: CreateDtoUser) {
    return this.userService.createUser(registerData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Body() authData: CreateDtoAuth, @Req() req): Promise<any> {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
    return res.status(200).send({ success: true });
  }
}
