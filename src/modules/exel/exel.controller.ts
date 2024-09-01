import { Controller, Get } from '@nestjs/common';
import {ExcelService} from "./exel.service";

@Controller('exel')
export class ExelController {
    constructor(private readonly excelService: ExcelService) {
    }

    @Get()
    async importData(): Promise<string> {
        const filePath = '/Users/ybeomsu/Desktop/mbti/updated_keyword.xlsx';
        await this.excelService.importExcelFile(filePath);
        return 'Data import complete';
    }
}
