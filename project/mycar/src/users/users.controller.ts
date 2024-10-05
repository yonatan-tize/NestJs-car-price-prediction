import { Body,  Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
    constructor(private readonly usersServices: UsersService){}

    @Post('/signup')
    createUser(@Body() user: CreateUserDto){
        return this.usersServices.create(user)
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
    updateUser(@Param('id') id: string, @Body() user: UpdateUserDto){
        this.usersServices.update(+id, user)
    }

    @Delete()
    removeUser(@Param('id') id: string){
        this.usersServices.remove(+id)
    }



}
