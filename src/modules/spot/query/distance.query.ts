import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class DistanceQuery {
    @ApiProperty({
        description: '출발지 x 좌표',
        example: '63829',
    })
    @IsNotEmpty()
    startMapX: number;

    @ApiProperty({
        description: '출발지 y 좌표',
        example: '63829',
    })
    @IsNotEmpty()
    startMapY: number;

    @ApiProperty({
        description: '도착지 x 좌표',
        example: '63829',
    })
    @IsNotEmpty()
    endtMapX: number;

    @ApiProperty({
        description: '도착지 y 좌표',
        example: '63829',
    })
    @IsNotEmpty()
    endMapY: number;
}
