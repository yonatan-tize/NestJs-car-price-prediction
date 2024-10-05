import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'; 
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>){}

    async create(user: CreateUserDto){
        const newUser = this.userRepository.create(user)

        return this.userRepository.save(newUser)
    }

    async findOne(id: number){
        return this.userRepository.findOne({where: {id}})
    }

    async find(email: string){
        return this.userRepository.find({where: {email}})
    }

    async update(id : number, user: UpdateUserDto){
        return this.userRepository.update(id, user)
    }

    async remove(id: number){
        const foundUser = await this.userRepository.findOne({where:{id}})

        return this.userRepository.remove(foundUser)
    }

}
