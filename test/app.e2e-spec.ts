import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import * as pactum from 'pactum';
import { UpdateUserDto } from '../src/user/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanUp();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'codersworld@gmail.com',
      password: 'codersone',
    };
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect(); to get a response
      });
    });
    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
        //store the token - check it using inspect()
        // .inspect(); to get a response
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('Get the current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('Edit the current user', () => {
        const dto: UpdateUserDto = {
          firstName: 'Fred',
          email: 'fred@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users/profile')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });
  describe('Bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'bookmark',
      link: 'https://www.bookmark.com',
      description: 'bookmark description',
    };
    describe('Create Bookmark', () => {
      it('should throw if title is empty', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withBody({
            title: dto.title,
          })
          .stores('bookmarkId', 'id')
          .stores('userId', 'userId')
          .expectStatus(400);
      });
      it('should throw if link is empty', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withBody({
            link: dto.link,
          })
          .expectStatus(400);
      });
      it('should create a new bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({
            title: dto.title,
            link: dto.link,
            description: dto.description,
          })
          .expectStatus(201);
      });
    });
    describe('Get Bookmarks', () => {
      it('should get all the bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark by id', () => {
      it('should get bookmarkby id', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectBodyContains('$S{bookmarkId}')
          .expectStatus(200);
      });
    });
    describe('Get Bookmark by userId', () => {
      it('should get a bookmark by userId', () => {
        return pactum
          .spec()
          .patch('/bookmark/{userId}')
          .withPathParams('userId', '$S{userId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectBodyContains('$S{userId}')
          .expectStatus(200);
      });
    });
    describe('Edit bookmark', () => {
      it('should update a bookmark', () => {
        const dto: UpdateBookmarkDto = {
          title: 'bookmark',
          link: 'https://www.bookmark.com',
          description: 'bookmark description',
        };
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectStatus(200);
      });
    });
    describe('Delete Bookmark', () => {
      it('should delete a bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectBodyContains('$S{bookmarkId}')
          .expectStatus(204);
      });
    });
    describe('Empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
