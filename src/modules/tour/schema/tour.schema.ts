import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TourDocument = Tour & Document;

@Schema()
export class Tour {
    @Prop({ required: true, unique: true })
    contentId: number;  // Primary index

    @Prop({ required: true })
    address: string;

    @Prop({ required: false })
    imageUrl: string;

    @Prop({ required: true, index: true })
    code: number;

    @Prop({ required: true })
    title: string;

    @Prop({ type: [Number], required: true })
    keywords: number[];

    @Prop({
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    })
    location: {
        type: string,
        coordinates: [number, number] // [longitude, latitude]
    };
}

export const TourSchema = SchemaFactory.createForClass(Tour);

TourSchema.index({ contentId: 1 }, { unique: true });
TourSchema.index({ code: 1 });
TourSchema.index({ keywords: 1 });
TourSchema.index({ location: '2dsphere' });
