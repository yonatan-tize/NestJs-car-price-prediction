import { Controller, Get, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {

    @Get()
    listMessage(){
        return "hello world ananiya mesfin"
    }

    @Post()
    createMessage(){

    }

    @Get('/:id')
    getMessage(){

    }
}
