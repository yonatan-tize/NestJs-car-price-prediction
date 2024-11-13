import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Report } from 'src/reports/report.entity'
@Entity({name: "users"})
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @Column({default: true})
    admin: boolean

    @OneToMany(
        ()=> Report, (report) => report.user
    )
    reports: Report[]
}