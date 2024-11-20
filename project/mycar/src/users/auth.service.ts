import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify} from 'util'

const scrypt = promisify(_scrypt) 
 
@Injectable()
export class AuthService{
    constructor(private readonly usersService: UsersService){}

    async signUp(newUser: CreateUserDto){
        const [registeredUser] = await this.usersService.find(newUser.email)
        if (registeredUser) throw new BadRequestException('email already exists')

        const salt = randomBytes(8).toString('hex')

        const hash = (await scrypt(newUser.password, salt, 32)) as Buffer

        const hashedPassword = salt + '.' + hash.toString('hex')

        const user = await this.usersService.create(newUser.email, hashedPassword)
 
        return user
         
    }

    async signIn(email: string, password:string){
        const [user] = await this.usersService.find(email)
        if (!user) throw new NotFoundException('user not found')

        const [salt, storedHash] = user.password.split('.')

        const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex')
        if (hash != storedHash){
            throw new BadRequestException('wrong password')
        }
        return user
    }
}