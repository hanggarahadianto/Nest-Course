import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDtoUser {
  @IsString()
  @IsNotEmpty({ message: 'tidak boleh kosong' })
  @MinLength(3, { message: 'minimal 3 huruf' })
  @MaxLength(12, { message: 'maksimal 12 huruf' })
  firstname: string;

  @IsString()
  @IsNotEmpty({ message: 'tidak boleh kosong' })
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'password minimal 5 huruf' })
  password: string;

  @IsString()
  @IsOptional()
  profilePic: string;
}
