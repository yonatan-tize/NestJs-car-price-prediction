import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>
  let mockAuthService: Partial<AuthService>


  beforeEach(async () => {

    mockAuthService = {
      signUp: (newUser: CreateUserDto) => {
        return Promise.resolve({id: 100, ...newUser})
      },
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 200, email, password})
      }
    }

    mockUsersService = {
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password:'123456'}])
      },

      findOne: (id: number) => {
        return Promise.resolve({id , email: 'test@test.com', password:'123456'})
      },

      update: (id: number,  { email, password}: UpdateUserDto ) => {
        return Promise.resolve({id, email, password: password})
      },
      
      remove: (id: number) => {
        return Promise.resolve({id, email: "test2@test.com" , password: "123456"})
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        { 
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find returns the list of users in with the given email address', async ()=>{
    const users = await controller.find("test@test.com");

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("test@test.com")

  });

  it('findUser returns the user with the given id', async()=>{
    const user = await controller.findUser('1')
    // Promise.resolve({id , email: 'test@test.com', password:'123456'})

    expect(user.id).toEqual(1)
    expect(user.email).toEqual('test@test.com')
  });

  it('findUser returns an error if id not found', async()=>{
    mockUsersService.findOne = jest.fn().mockImplementation((id: number) => {
      return Promise.reject(new NotFoundException());
    });
    
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it("signIn should return email and password", async () => {
  //   mockAuthService.signIn = jest.fn().mockImplementation((email: string, password: string) => {
  //   return Promise.resolve({ id: 112, email: "test@gmail.com", password: "12344" });
  // });

    const user = await controller.signIn({ email: "test@gmail.com", password: "12344" }, {userId: ""});
    expect(user.email).toEqual("test@gmail.com");
    expect(user.password).toEqual("12344");
  });

  it("create user should return email id and password", async()=>{
    const user = await controller.createUser({email: "test@gmail.com", password: "12344"})

    expect(user).toBeDefined();
  })
});
