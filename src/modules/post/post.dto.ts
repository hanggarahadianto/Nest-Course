import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';
import { Category } from '../category/category.entity';
// import { ApiProperty, PartialType } from '@nestjs/swagger';


export class CreateDtoPost {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter something for content' })
  content: string;

  @IsOptional()
  @IsString()
  mainImageUrl: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsOptional()
  category: Category


}

export class UpdateDtoPost extends PartialType(CreateDtoPost){
  static category: any;
}

