import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {

    constructor(public messageService: MessagesService){}

    @Get()
    listMessage(){
        return this.messageService.findAll()
    }

    @Post()
    createMessage(@Body() body: CreateMessageDto){
        return this.messageService.create(body.content)
    } 

    @Get('/:id')
    getMessage(@Param('id') id: string){
        return this.messageService.findOne(id)
    }
}
