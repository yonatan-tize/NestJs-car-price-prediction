import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>
    ){}

    async getEstimate(getEstimateDto: GetEstimateDto){
        return this.reportRepository
                .createQueryBuilder()
                .select('AVG(price', 'price')
                .where('make = :make', {make: getEstimateDto.make})
                .andWhere('model = :model', {model: getEstimateDto.model})
                .andWhere('lng - :lng BETWEEN -5 and 5', {lng: getEstimateDto.lng})
                .andWhere('lat - :lat BETWEEN -5 and 5', {lat: getEstimateDto.lat})
                .andWhere('year - :year BETWEEN -3 and 3', {year: getEstimateDto.year})
                .andWhere('approved IS TRUE')
                .orderBy('ABS(mileage - :mileage', 'DESC')
                .setParameters({mileage: getEstimateDto.mileage})
                .limit(3)
                .getRawOne()
    }

    async create(reportDto: CreateReportDto, user: User){
        const report = this.reportRepository.create(reportDto)
        report.user = user;
        return await this.reportRepository.save(report) 
    }

    async changeApproval(id: number, approved: boolean){
        const report = await this.reportRepository.findOneBy({ id })
        if (!report){
            throw new NotFoundException('report not found')
        }

        report.approved = approved
        return this.reportRepository.save(report)
    }
}

