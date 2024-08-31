import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {TourSchema} from "./tour.schema";

export type TravelCourseDocument = TravelCourse & Document;

@Schema()
export class Location {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    id: number;
}

@Schema()
export class TravelCourse {
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
