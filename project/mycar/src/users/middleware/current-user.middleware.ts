import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Request, Response, NextFunction } from "express";

export class CurrentUserMiddleware implements NestMiddleware{
    constructor(
        private readonly usersService: UsersService, 
    ){}
    
    async use(req: Request, res: Response, next: NextFunction){
        const { userId } = req.session || {}
        if (userId){
            const user = await this.usersService.findOne(userId)
            //@ts-ignore           
            req.currentUser = user
        };

        next();
    };
}; 