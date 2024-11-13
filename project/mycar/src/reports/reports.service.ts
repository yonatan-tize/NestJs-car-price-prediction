import { Injectable, NotFoundException } from '@nestjs/common';
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

    async changeApproval(id: number, approved: boolean){
        const report = await this.reportRepository.findOneBy({ id })
        if (!report){
            throw new NotFoundException('report not found')
        }

        report.approved = approved
        return this.reportRepository.save(report)
    }
}

