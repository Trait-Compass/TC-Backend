import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";
import {SignupRequest} from "../dto/request/signup.request";
import {SignupResponse} from "../dto/response/signup.response";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async signup(signup:SignupRequest) : Promise<SignupResponse> {
        if(await this.checkId(signup.id)){
            throw new BadRequestException('중복된 아이디 입니다');
        }

        if(await this.checkNickname(signup.nickname)){
            throw new BadRequestException('중복된 닉네임 입니다');
        }
        const entity = await this.userRepository.save(
            {tcId: signup.id, nickname: signup.nickname, password: signup.password, mbti: signup.mbti, gender : signup.gender}
        );

        return {
            id: entity.tcId,
            nickname: entity.nickname
        }
    }
    async checkId(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { tcId : id } });
        return !!user;
    }

    async checkNickname(nickname: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { nickname } });
        return !!user;
    }
}
