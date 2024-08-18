import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Tour, TourDocument} from "../tour/schema/tour.schema";

interface exelRow {
    contentId: number;
    address: string;
    imageUrl: string;
    mapx: string;
    mapy: string;
    code: number;
    title: string;
    keywords: number[];
}

@Injectable()
export class ExcelService {
    constructor(
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    ) {}

    async importExcelFile(filePath: string): Promise<void> {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data: exelRow[] = XLSX.utils.sheet_to_json(sheet);

        for (const row of data) {

            const keywordsArray: number[] = JSON.parse(row.keywords as any);

            const newTouristSpot = new this.tourModel({
                contentId: row.contentId,
                address: row.address,
                imageUrl: row.imageUrl,
                mapx: row.mapx,
                mapy: row.mapy,
                code: row.code,
                title: row.title,
                keywords: keywordsArray,
            });

            await newTouristSpot.save();
        }

        console.log('Data successfully imported into MongoDB');
    }
}
