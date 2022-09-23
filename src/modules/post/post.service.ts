import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateDtoPost, UpdateDtoPost } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async create(postData: CreateDtoPost, user: User) {
    const post = new Post();
    post.userId = user.id;
    Object.assign(post, postData);

    this.postRepo.create(post);
    return await this.postRepo.save(post);
  }
  async findAll(query?: string) {
    const myQuery = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.user', 'user');

    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query);

      if (queryKeys.includes('slug')) {
        myQuery.where('post.slug LIKE :slug', { slug: `%${query['slug']}%` });
      }
      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase());
      }

      if (queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :category', {
          category: query['category'],
        });
      }

      return await myQuery.getMany();
    } else {
      return await myQuery.getMany();
    }
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOneBy({ id: id });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.postRepo.findOneBy({ slug });
    if (!post) {
      throw new BadRequestException(`Post with slug ${slug} not found`);
    }
    return post;
  }

  async update(slug: string, updatePost: UpdateDtoPost) {
    const post = await this.postRepo.findOneBy({ slug });

    if (!post) {
      throw new BadRequestException('post not found');
    }

    post.modifiedOn = new Date(Date.now());
    post.category = updatePost.category;
    Object.assign(post, updatePost);
    return this.postRepo.save(post);
  }

  async remove(id: number) {
    const post = await this.postRepo.findOneBy({ id });
    await this.postRepo.remove(post);
    return { success: true, post };
  }
}
