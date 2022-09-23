import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDtoAuth {
  @IsEmail()
  @IsNotEmpty({ message: 'tidak boleh kosong' })
  email: string;

  @IsString()
  password: string;
}
