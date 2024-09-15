import {BadRequestException, Injectable} from '@nestjs/common';
import {SignupRequest} from "../dto/request/signup.request";
import {SignupResponse} from "../dto/response/signup.response";
import {LoginRequest} from "../dto/request/login.request";
import {AuthService} from "../../auth/service/auth.service";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schema/user.schema";
import {Model} from "mongoose";
import {MBTI} from "../../../common/enums";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: AuthService
    ) {}

    async login(loginRequest: LoginRequest): Promise<string> {
        const user = await this.userModel.findOne({ tcId: loginRequest.id }).exec();
        if (user) {
            if (user.password !== loginRequest.password) {
                throw new BadRequestException('비밀번호가 틀렸습니다');
            }
        } else {
            throw new BadRequestException('존재하지 않는 아이디 혹은 이메일입니다');
        }

        return this.jwtService.createJwt(user.role, user._id.toString());
    }

    async createUser(signup:SignupRequest) : Promise<SignupResponse> {
        if(await this.checkId(signup.id)){
            throw new BadRequestException('중복된 아이디입니다');
        }

        if(await this.checkNickname(signup.nickname)){
            throw new BadRequestException('중복된 닉네임입니다');
        }

        const newUser = new this.userModel({
            tcId: signup.id,
            nickname: signup.nickname,
            password: signup.password,
            mbti: signup.mbti,
            gender: signup.gender,
            isOauth: signup.isOauth,
        });

        const entity = await newUser.save();

        return {
            id: entity.tcId,
            nickname: entity.nickname,
        };
    }
    async checkId(id: string): Promise<boolean> {
        const user = await this.userModel.findOne({ tcId: id }).exec();
        return !!user;
    }

    async checkNickname(nickname: string): Promise<boolean> {
        const user = await this.userModel.findOne({ nickname }).exec();
        return !!user;
    }

    async findByTcId(tcId: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ tcId }).exec();
    }

    async patchMbti(mbti: MBTI, id: string): Promise<void> {
        const user = await this.userModel.findById(id).exec(); // Pass `id` directly as a string
        user.mbti = mbti;
        await user.save();
    }
}
