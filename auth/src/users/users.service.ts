import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs'
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel:  Model<User>
    ){}

    async create(createUserDto: CreateUserDto){
        //hash password and save the user
        const hashedPassword = await hash(createUserDto.password, 10);

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword
        });

        return await newUser.save()
    }
}
