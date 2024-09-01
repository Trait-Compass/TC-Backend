import { Controller, Get, Post, Body } from '@nestjs/common';
import {TourService} from "./service/tour.service";

@Controller('travel')
export class TravelController {
    constructor(private readonly travelService: TourService) {}

    @Post('import')
    async importData() {
        const filePath = '/Users/ybeomsu/Downloads/여행코스 제작.xlsx';
        await this.travelService.importDataFromExcel(filePath);
        return { message: 'Data imported successfully' };
    }

}
