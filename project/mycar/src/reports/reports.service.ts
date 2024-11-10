import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>
    ){}

    async create(reportDto: CreateReportDto, user: User){
        const report = this.reportRepository.create(reportDto)
        report.user = user;
        return await this.reportRepository.save(report) 
    }
}
