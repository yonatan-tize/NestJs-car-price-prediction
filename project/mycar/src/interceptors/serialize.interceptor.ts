import {
    UseInterceptors,
    NestInterceptor, 
    ExecutionContext,
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {plainToClass} from 'class-transformer'
import { UserDto } from 'src/users/dto/user.dto'

export class SerializeInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // code written here will be running before the request is handled

        return next.handle().pipe(
            map((data:any)=>{
                //code that get executed before the response is sent  
                return plainToClass(UserDto, data, {
                    excludeExtraneousValues: true
                })
            }
        )
    )}
}