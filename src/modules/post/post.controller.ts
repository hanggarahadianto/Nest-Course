import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDtoPost, UpdateDtoPost } from './post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UseRoles, ACGuard } from 'nest-access-control';
import { User } from '../user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'posts',
    action: 'create',
    possession: 'any',
  })
  // create(@Body() postData: CreateDtoPost, @Req() req: Request) {
  //   return this.postService.create(postData, req.user as User);
  // }
  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFilename =
            name.split(' ').join(' ') + '_' + Date.now() + '.' + fileExtension;
          cb(null, newFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        error: 'File is not an image',
      };
    } else {
      const response = {
        filePath: `http://localhost:3000/api/posts/pictures/${file.filename}`,
      };
      return response;
    }
  }

  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.postService.findAll(query);
  }

  @Get('pictures/:fileId')
  async serveAvatar(@Param('fiedId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: './uploads' });
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'posts',
    action: 'update',
    possession: 'any',
  })
  update(@Param('slug') slug: string, @Body() updatePost: UpdateDtoPost) {
    return this.postService.update(slug, updatePost);
  }

  @Delete('id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'posts',
    action: 'delete',
    possession: 'any',
  })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
