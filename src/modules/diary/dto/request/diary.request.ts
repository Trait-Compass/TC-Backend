import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf
} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Angry, Comfortable, Disappointed, Happy, Nature, Sad, Satisfied, Surprised} from "../../../../common/enums";
import {Transform} from "class-transformer";

const splitAndTrim = (value: any): string[] => {
    if (typeof value === 'string') {
        return value.split(',').map(v => v.trim());
    }
    return value;
};

export class DiaryRequest {

    @ApiProperty({ example: '고성 낭만 투어', required: true })
    @IsString()
    courseName: string;

    @ApiProperty({ required: true })
    @IsDate()
    @Transform(({ value }) => new Date(value))
    travelDate: Date;

    @ApiProperty({ description: '일기 종류', example: 'T', required: true, enum: Nature})
    @IsEnum(Nature)
    nature: Nature;

    @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' }, description: '여행에서 찍은 사진들 (최대 10장)' })
    @ValidateIf(o => o.travelPhotos !== undefined && o.travelPhotos !== null && o.travelPhotos !== '')
    @IsOptional()
    @IsArray()
    travelPhotos?: Express.Multer.File[] | null;

    // 만족도 평가
    @ApiPropertyOptional({ example: 8, description: '교통 편의성 만족도 (0~10)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    transportationSatisfaction?: number;

    @ApiPropertyOptional({ example: 9, description: '관광 명소 만족도 (0~10)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    sightseeingSatisfaction?: number;

    @ApiPropertyOptional({ example: 7, description: '숙소 만족도 (0~10)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    accommodationSatisfaction?: number;

    @ApiPropertyOptional({ example: 6, description: '가격 대비 만족도 (0~10)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    priceSatisfaction?: number;

    @ApiPropertyOptional({ example: 8, description: '환경 및 위생 만족도 (0~10)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    environmentSatisfaction?: number;

    @ApiPropertyOptional({ example: 9, description: '음식 만족도 (0~10)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    @Transform(({ value }) => Number(value))
    foodSatisfaction?: number;

    // 피드백 필드
    @ApiPropertyOptional({ example: '여행이 정말 즐거웠어요.', description: '만족한 점' })
    @IsOptional()
    @IsString()
    satisfactionFeedback?: string;

    @ApiPropertyOptional({ example: '숙소 서비스가 조금 부족했어요.', description: '유지할 점' })
    @IsOptional()
    @IsString()
    keepFeedback?: string;

    @ApiPropertyOptional({
        type: [String],
        enum: Happy,
        description: '행복 관련 감정 (복수 선택 가능)',
        example: ['기쁨', '즐거움'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Happy, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    happyEmotions?: Happy[];

    @ApiPropertyOptional({
        type: [String],
        enum: Satisfied,
        description: '만족 관련 감정 (복수 선택 가능)',
        example: ['성취감', '감동적임'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Satisfied, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    satisfiedEmotions?: Satisfied[];

    @ApiPropertyOptional({
        type: [String],
        enum: Comfortable,
        description: '편안함 관련 감정 (복수 선택 가능)',
        example: ['안락함', '평화로움'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Comfortable, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    comfortableEmotions?: Comfortable[];

    @ApiPropertyOptional({
        type: [String],
        enum: Surprised,
        description: '놀람 관련 감정 (복수 선택 가능)',
        example: ['감탄', '새로운 발견'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Surprised, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    surprisedEmotions?: Surprised[];

    @ApiPropertyOptional({
        type: [String],
        enum: Disappointed,
        description: '실망 관련 감정 (복수 선택 가능)',
        example: ['아쉬움', '후회'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Disappointed, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    disappointedEmotions?: Disappointed[];

    @ApiPropertyOptional({
        type: [String],
        enum: Sad,
        description: '슬픔 관련 감정 (복수 선택 가능)',
        example: ['우울함', '절망감'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Sad, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    sadEmotions?: Sad[];

    @ApiPropertyOptional({
        type: [String],
        enum: Angry,
        description: '화남 관련 감정 (복수 선택 가능)',
        example: ['짜증', '분노'],
        isArray: true
    })
    @IsOptional()
    @IsEnum(Angry, { each: true })
    @Transform(({ value }) => splitAndTrim(value))
    angryEmotions?: Angry[];

    // 피드백 필드
    @ApiPropertyOptional({ example: '여행이 정말 즐거웠어요.', description: '긍정적인 피드백' })
    @IsOptional()
    positiveFeedback?: string;

    @ApiPropertyOptional({ example: '숙소 서비스가 조금 부족했어요.', description: '개선할 점' })
    @IsOptional()
    improvementFeedback?: string;

    @ApiPropertyOptional({ example: '이번 여행은 정말 잊을 수 없을 것 같아요.', description: '여행을 마무리하는 한 마디' })
    @IsOptional()
    finalThoughts?: string;
}
