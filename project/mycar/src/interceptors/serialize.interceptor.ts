import {
    UseInterceptors,
    NestInterceptor, 
    ExecutionContext,
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {plainToInstance} from 'class-transformer'

//interface to make the serializer work only for class
interface classConstructor{
    new (...args: any[]): {}
}

export const Serialize = (dto: classConstructor)=>{
    return UseInterceptors(new SerializeInterceptor(dto))
}
class SerializeInterceptor implements NestInterceptor{
    constructor (private readonly dto: any){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // code written here will be running before the request is handled

        return next.handle().pipe(
            map((data:any)=>{
                //code that get executed before the response is sent  
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                })
            }
        )
    )}
}