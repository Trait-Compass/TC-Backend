import { IsString, IsArray, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LocationDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: '여행지 아이디 (관광공사 아이디)',
        example: '2623675',
    })
    contentId: number;
}

export class PcourseSaveRequestDto {
    @IsString()
    @ApiProperty({
        description: '여행하는 시,군',
        example: '마산',
    })
    region: string;

    @IsString()
    @ApiProperty({
        description: '코스 이름',
        example: '마산 투어',
    })
    courseName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: '기간',
        example: '2박3일',
    })
    duration: string;

    @IsArray()
    @IsOptional()
    @Type(() => LocationDto)
    @ApiPropertyOptional({
        type: [LocationDto],
    })
    day1?: LocationDto[];

    @IsArray()
    @IsOptional()
    @Type(() => LocationDto)
    @ApiPropertyOptional({
        type: [LocationDto],
    })
    day2?: LocationDto[];

    @IsArray()
    @IsOptional()
    @Type(() => LocationDto)
    @ApiPropertyOptional({
        type: [LocationDto],
    })
    day3?: LocationDto[];
}
