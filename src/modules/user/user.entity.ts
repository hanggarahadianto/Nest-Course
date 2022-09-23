import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../post/post.entity';
import { UserRoles } from './user.roles.models';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  profilePic: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Reader })
  roles: UserRoles;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
