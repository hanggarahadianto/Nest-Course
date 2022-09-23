import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
  imports: [forwardRef(() => PostModule), TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
