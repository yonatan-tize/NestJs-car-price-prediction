import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app)
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = "test9@gmail.com" 
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)
      .then((res)=>{
        const {id, resEmail} = res.body
        expect(id).toBeDefined();
        expect(resEmail).toEqual(email)

      })
  });
});
