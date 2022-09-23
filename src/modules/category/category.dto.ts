import { IsString } from 'class-validator';

export class CreateDtoCategory {
  @IsString()
  title: string;

  @IsString()
  decription: string;
}
