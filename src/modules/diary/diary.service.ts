import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Diary, DiaryDocument} from "./schema/diary.schema";
import {DiaryRequest} from "./dto/request/diary.request";
import { v4 as uuidv4 } from 'uuid';
import {Inject} from "@nestjs/common";
import {S3} from "@aws-sdk/client-s3";
import {GptService} from "../gpt/gpt.service";

export class DiaryService {
    constructor(
        @InjectModel(Diary.name) private diaryModel: Model<DiaryDocument>,
        @Inject(S3) private readonly s3: S3,
        @Inject() private readonly gptService: GptService,
    ) {}

    async createDiary(diaryRequest: DiaryRequest, files: Array<Express.Multer.File>, userId: string) {

        const bucketName = process.env.AWS_S3_BUCKET;
        const travelPhotosWithKeywords: { imageUrl: string, keywords: string[] }[] = [];


        for (const file of files) {
            const s3Key = `travel-photos/${uuidv4()}`;
            await this.s3.putObject({
                Bucket: bucketName,
                Key: s3Key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            });
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

            const gptKeywords = await this.gptService.chatGptVision(fileUrl);
            travelPhotosWithKeywords.push({ imageUrl: fileUrl, keywords: JSON.parse(gptKeywords) });
        }

        const newDiary = new this.diaryModel({
            user: userId,
            travelPhotos: travelPhotosWithKeywords,
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
