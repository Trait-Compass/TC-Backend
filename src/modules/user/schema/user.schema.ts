import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import { GENDER, MBTI, ROLE } from '../../../common/enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true })
    tcId: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: MBTI, required: true })
    mbti: MBTI;

    @Prop({ required: true })
    nickname: string;

    @Prop({ type: String, enum: GENDER, default: null })
    gender: GENDER;

    @Prop({ type: String, enum: ROLE, default: ROLE.USER })
    role: ROLE;

    @Prop({ type: Boolean, default: false })
    isOauth: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Diary' }], default: [] })
    diaries: Types.ObjectId[];

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
