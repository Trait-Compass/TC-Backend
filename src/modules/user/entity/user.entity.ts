import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {GENDER, MBTI, ROLE} from "../../../common/enums";
import {Get} from "@nestjs/common";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({nullable: false})
    tcId: string;

    @Column({nullable: false})
    password: string;

    @Column({ type : 'enum', enum : MBTI})
    mbti: MBTI;

    @Column()
    nickname: string;

    @Column({ type : 'enum', enum : GENDER, nullable: true})
    gender: string;

    @Column({ type : 'enum', enum : ROLE, default: ROLE.USER})
    role: string;

    @CreateDateColumn({nullable: false})
    createdAt: string;

    @UpdateDateColumn({nullable: false})
    updatedAt: string;

    @Column({nullable : false, default : false})
    isOauth: boolean;


}
