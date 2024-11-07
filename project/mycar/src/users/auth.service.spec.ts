import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';


describe('AuthService', ()=>{
    let service : AuthService
    let mockUsersService: Partial<UsersService>

    beforeEach( async()=>{
        // Create a mock users service
        const users: User[] = []
        mockUsersService = {
            find: (email: string) =>{ 
                const filteredUsers = users.filter((user)=> user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) =>{
                const user = { id: Math.floor(Math.random() * 99999), email, password }
                users.push(user)
                return Promise.resolve(user)
            },
        };
        
        const module = await Test.createTestingModule({
            providers: [
            AuthService,
            {
                provide: UsersService,
                useValue: mockUsersService,
            },
            ],
        }).compile();
        
        service = module.get(AuthService);
    })
    
    it('can create an instance of auth service', async () => { 
      expect(service).toBeDefined();
    });

    it('create  a new user with salted and hashed password', async()=>{
        const user = await service.signUp({email:'yoni@test.com', password:'123456'})
        
        expect(user.password).not.toEqual('123456')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    });

    it('throw an error if email already exists for signup', async () =>{

        await service.signUp({email: 'test111@gmail.com', password: '123456'})

        await expect(service.signUp({ email: 'test111@gmail.com', password: '1234564' }))
        .rejects.toThrow(BadRequestException);
    });

    it('(sign in) throw an error message if user not found', async ()=>{
        mockUsersService.find = () => Promise.resolve([])

        await expect(service.signIn("test@test.com", '123456'))
        .rejects.toThrow(NotFoundException)
    });

    it('(sign in) throw an error if an invalid password is provided', async()=>{
        // mockUsersService.find = () => 
        //     Promise.resolve([{id: 1, email: "test@test.com", password: "123456"}])
        await service.signUp({email:'test222@gmail.com', password: '123456'})

        await expect(service.signIn('test222@gmail.com', '1234567'))
        .rejects.toThrow(BadRequestException)
    });

    it('returns a user if correct password is provided', async ()=>{
        await service.signUp({email: 'test@gmail.com', password: '123456'})

        const user = await service.signIn('test@gmail.com', '123456')
        expect(user).toBeDefined();
    })

}); 
