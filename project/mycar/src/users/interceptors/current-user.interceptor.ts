import {
    NestInterceptor,
    Injectable,
    CallHandler,
    ExecutionContext,

} from '@nestjs/common'
import { UsersService } from '../users.service'
import { Observable } from 'rxjs'

export class CurrentUserInterceptor implements NestInterceptor{
    constructor( private readonly usersService: UsersService) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const { userId } = request.session || {}

        if (userId) {
            const user = this.usersService.findOne(userId)
            request.CurrentUser = user
        }

        return next.handle()
    }

}