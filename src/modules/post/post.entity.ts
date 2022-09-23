import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import slugify from 'slugify';
import { Exclude } from 'class-transformer';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  slug: string;

  @Column()
  @Exclude()
  categoryId: number

  @Column()
  @Exclude()
  userId: number

  @Column({ type: 'timestamp', default: (): string => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column({ type: 'timestamp', default: (): string => 'CURRENT_TIMESTAMP' })
  modifiedOn: Date;

  @Column()
  mainImageUrl: string;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'userId',
  })
  user: User;


  @ManyToOne(() => Category, (category) => category.posts, { eager: true })
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'categoryId',
  })
  cateogry: Category;
  category: any;

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substring(0,20),{
      lower: true,
      replacement: '_'
    })
  }
}
