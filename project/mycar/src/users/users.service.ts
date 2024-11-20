import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async create(email: string, password: string){
        const newUser = this.userRepository.create({email, password})

        return this.userRepository.save(newUser)
    }

    async findOne(id: number){
        if (id === null){
            throw new BadRequestException('user not signed in')
        }  
        const user = this.userRepository.findOne({where: {id}})
        if (!user){
            throw new NotFoundException()
        }
        return user
    }
  
    async find(email: string){
        return this.userRepository.find({where: {email}})
    }

    async update(id : number, user: UpdateUserDto){
        await this.userRepository.update(id, user)
        return this.userRepository.findOne({where: {id}})
    }

    async remove(id: number){
        const foundUser = await this.userRepository.findOne({where:{id}})

        return this.userRepository.remove(foundUser)
    }

}
