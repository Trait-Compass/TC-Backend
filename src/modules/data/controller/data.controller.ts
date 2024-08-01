import { Controller, Get } from '@nestjs/common';
import {DataService} from "../service/data.service";

@Controller('data')
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Get('fetch')
    async fetchDataAndGenerateCSV(): Promise<string> {
        await this.dataService.fetchDataAndGenerateCSV();
        return 'CSV file generated successfully';
    }
}
