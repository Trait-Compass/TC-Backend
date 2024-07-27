import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";
import {SignupRequest} from "../dto/request/signup.request";
import {SignupResponse} from "../dto/response/signup.response";
import {LoginRequest} from "../dto/request/login.request";
import {GENDER} from "../../../common/enums";
import {AuthService} from "../../auth/service/auth.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: AuthService
    ) {}

    async login(loginRequest: LoginRequest) : Promise<string> {
        const user = await this.userRepository.findOne({ where : {tcId: loginRequest.id}});
        if(user){
            if(user.password != loginRequest.password)
                throw new BadRequestException("비밀번호가 틀렸습니다");
        } else {
            throw new BadRequestException("존재하지 않는 아이디 혹은 이메일입니다");
        }

        return await this.jwtService.createJwt(user.role,user.id);

    }

    async signup(signup:SignupRequest) : Promise<SignupResponse> {
        if(await this.checkId(signup.id)){
            throw new BadRequestException('중복된 아이디입니다');
        }

        if(await this.checkNickname(signup.nickname)){
            throw new BadRequestException('중복된 닉네임입니다');
        }

        if (!(signup.gender in GENDER)) {
            throw new BadRequestException('잘못된 성별입니다');
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

    async findByTcId(tcId : string){
        return await this.userRepository.findOne({ where: { tcId } });
    }

}
