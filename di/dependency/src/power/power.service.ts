import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {
    supplyPower(watts: number){
        console.log(`supply ${watts} worth of power`)
    }
}
