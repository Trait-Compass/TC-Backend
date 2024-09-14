import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {Angry, Comfortable, Disappointed, Happy, Nature, Sad, Satisfied, Surprised} from "../../../common/enums";
import {User} from "../../user/schema/user.schema";

export type DiaryDocument = Diary & Document;

@Schema({ timestamps: true })
export class Diary {

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: String})
    courseName: string;

    @Prop()
    travelDate: Date;

    @Prop()
    nature: Nature;

    @Prop({
        type: [{
            imageUrl: { type: String, required: true },
            keywords: { type: [String], required: true }
        }],
        required: false,
        default: []
    })
    travelPhotos: { imageUrl: string, keywords: string[] }[];

    // Satisfaction chart
    @Prop({ type: Number, min: 0, max: 10 })
    transportationSatisfaction: number;

    @Prop({ type: Number, min: 0, max: 10 })
    sightseeingSatisfaction: number;

    @Prop({ type: Number, min: 0, max: 10 })
    accommodationSatisfaction: number;

    @Prop({ type: Number, min: 0, max: 10 })
    priceSatisfaction: number;

    @Prop({ type: Number, min: 0, max: 10 })
    environmentSatisfaction: number;

    @Prop({ type: Number, min: 0, max: 10 })
    foodSatisfaction: number;

    // Emotion chart
    @Prop({ type: [String], enum: Happy, required: false })
    happyEmotions: Happy[];

    @Prop({ type: [String], enum: Satisfied, required: false })
    satisfiedEmotions: Satisfied[];

    @Prop({ type: [String], enum: Comfortable, required: false })
    comfortableEmotions: Comfortable[];

    @Prop({ type: [String], enum: Surprised, required: false })
    surprisedEmotions: Surprised[];

    @Prop({ type: [String], enum: Disappointed, required: false })
    disappointedEmotions: Disappointed[];

    @Prop({ type: [String], enum: Sad, required: false })
    sadEmotions: Sad[];

    @Prop({ type: [String], enum: Angry, required: false })
    angryEmotions: Angry[];

    @Prop({ required: false })
    positiveFeedback: string;

    @Prop({ required: false })
    improvementFeedback: string;

    @Prop({ required: false })
    finalThoughts: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
