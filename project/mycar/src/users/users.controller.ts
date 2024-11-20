import{ Body, 
        Controller, 
        Delete, 
        Get, 
        Param, 
        Patch, 
        Post, 
        Query,
        Session,
        UseGuards
    } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Serialize } from 'src/interceptors/serialize.interceptor'
// import { UserDto } from 'src/users/dto/user.dto';
// import { AuthService } from 'src/users/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private readonly usersServices: UsersService,
        private readonly authService: AuthService
    ){}

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user
    }

    @Post('/logout')
    logOut(@Session() session: any) { 
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() createUserDto: CreateUserDto){
        const user = await this.authService.signUp(createUserDto)
        return user;
    }
 
    @Post('/signin')
    async signIn(@Body() createUserDto: CreateUserDto, @Session() session: any){
        const user = await this.authService.signIn(createUserDto.email, createUserDto.password)
        session.userId = user.id
        return user
    }

    @Get('/:id')
    findUser(@Param('id') id: string){
       return this.usersServices.findOne(+id)
    }

    @Get()
    find(@Query('email') email:string){
        return this.usersServices.find(email)
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto){
        return await this.usersServices.update(+id, user)
         
    }

    @Delete('/delete/:id')
    async removeUser(@Param('id') id: string){
        return await this.usersServices.remove(+id)
    }
}
