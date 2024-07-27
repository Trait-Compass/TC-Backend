import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {MBTI, ROLE} from "../../../common/enums";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({nullable: false})
    tcId: string;

    @Column({nullable: false})
    password: string;

    @Column({ type : 'enum', enum : MBTI, nullable: false})
    mbti: MBTI;

    @Column()
    nickname: string;

    @Column({ type : 'enum', enum : ROLE, default: ROLE.USER, nullable: false})
    role: string;

    @CreateDateColumn({nullable: false})
    createdAt: string;

    @UpdateDateColumn({nullable: false})
    updatedAt: string;

    @Column({nullable : false, default : false})
    isOauth: boolean;


}
