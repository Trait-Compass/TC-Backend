import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {TourSchema} from "./tour.schema";
import {Keyword} from "../../../common/enums";
import {User} from "../../user/schema/user.schema";

export type TravelCourseDocument = TravelCourse & Document;

@Schema()
export class TravelInfoToNext {
    @Prop({ required: true })
    distance: string;

    @Prop({ required: true })
    carTime: string;

    @Prop({ required: true })
    walkingTime: string;
}

@Schema()
export class Location {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    id: number;

    @Prop()
    imageUrl?: string;

    @Prop()
    keywords?: Keyword[];

    @Prop({ type: TravelInfoToNext })
    travelInfoToNext?: TravelInfoToNext;
}

@Schema()
export class TravelCourse {

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user?: User;

    @Prop({ required: true })
    region: string;

    @Prop({ required: true })
    courseName: string;

    @Prop({ required: true })
    duration: string;

    @Prop({ type: [Location], default: [] })
    day1: Location[];

    @Prop({ type: [Location], default: [] })
    day2: Location[];

    @Prop({ type: [Location], default: [] })
    day3: Location[];
}

export const TravelCourseSchema = SchemaFactory.createForClass(TravelCourse);

TourSchema.index({ region: 1 });
