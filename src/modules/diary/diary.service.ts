import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Diary, DiaryDocument} from "./schema/diary.schema";
import {User, UserDocument} from "../user/schema/user.schema";
import {DiaryRequest} from "./dto/request/diary.request";
import { v4 as uuidv4 } from 'uuid';
import {Inject} from "@nestjs/common";
import {S3} from "@aws-sdk/client-s3";

export class DiaryService {
    constructor(
        @InjectModel(Diary.name) private diaryModel: Model<DiaryDocument>,
        @Inject(S3) private readonly s3: S3,
    ) {}

    async createDiary(diaryRequest: DiaryRequest, files: Array<Express.Multer.File>, userId: string) {

        const bucketName = process.env.AWS_S3_BUCKET;
        const travelPhotos: string[] = [];

        for (const file of files) {
            const s3Key = `travel-photos/${uuidv4()}-${file.originalname}`;
            await this.s3.putObject({
                Bucket: bucketName,
                Key: s3Key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
            travelPhotos.push(fileUrl);
        }

        const newDiary = new this.diaryModel({
            user: userId,
            travelPhotos: travelPhotos,  // store photo paths
            transportationSatisfaction: diaryRequest.transportationSatisfaction,
            sightseeingSatisfaction: diaryRequest.sightseeingSatisfaction,
            accommodationSatisfaction: diaryRequest.accommodationSatisfaction,
            priceSatisfaction: diaryRequest.priceSatisfaction,
            environmentSatisfaction: diaryRequest.environmentSatisfaction,
            foodSatisfaction: diaryRequest.foodSatisfaction,
            happyEmotions: diaryRequest.happyEmotions,
            satisfiedEmotions: diaryRequest.satisfiedEmotions,
            comfortableEmotions: diaryRequest.comfortableEmotions,
            surprisedEmotions: diaryRequest.surprisedEmotions,
            disappointedEmotions: diaryRequest.disappointedEmotions,
            sadEmotions: diaryRequest.sadEmotions,
            angryEmotions: diaryRequest.angryEmotions,
            positiveFeedback: diaryRequest.positiveFeedback,
            improvementFeedback: diaryRequest.improvementFeedback,
            finalThoughts: diaryRequest.finalThoughts,
        });

        await newDiary.save();
    }
}
