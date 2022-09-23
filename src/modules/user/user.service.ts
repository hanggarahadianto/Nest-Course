import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateDtoUser } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(userData: CreateDtoUser): Promise<User> {
    const { email } = userData;

    const emailExist = await this.userRepo.findOne({
      where: { email },
    });

    if (emailExist) {
      throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
    }

    userData.password = this.hash(userData.password);

    return this.userRepo.save(userData);
  }

  async getUserId(userId: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  hash(plainPassword) {
    const hash = bcrypt.hashSync(plainPassword, 10);
    return hash;
  }

  compare(plainPassword, hash) {
    const valid = bcrypt.compareSync(plainPassword, hash);
    return valid;
  }
}
