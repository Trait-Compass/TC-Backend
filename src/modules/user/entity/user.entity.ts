import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {MBTI} from "../../../common/enums";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    tcId: string;

    @Column()
    password: string;

    @Column({ type : 'enum', enum : MBTI})
    mbti: MBTI;

    @Column()
    nickname: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;


}
