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

export class JcourseSaveRequestDto {
    @IsNumber()
    @ApiProperty({
        description: '여행하는 시,군 코드',
        example: '6',
    })
    code: number;

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

    @IsArray()
    @IsOptional()
    @Type(() => LocationDto)
    @ApiPropertyOptional({
        type: [LocationDto],
    })
    day4?: LocationDto[];

    @IsArray()
    @IsOptional()
    @Type(() => LocationDto)
    @ApiPropertyOptional({
        type: [LocationDto],
    })
    day5?: LocationDto[];
}
