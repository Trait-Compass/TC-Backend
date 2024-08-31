import {Injectable} from "@nestjs/common";
import {TravelCourse, TravelCourseDocument} from "../schema/course.schema";
import {Tour, TourDocument} from "../schema/tour.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as XLSX from 'xlsx';


@Injectable()
export class TourService {
    constructor(
        @InjectModel(Tour.name) private touristSpotModel: Model<TourDocument>,
        @InjectModel(TravelCourse.name) private travelCourseModel: Model<TravelCourseDocument>,
    ) {}

    async findByKeywords(keywords: number[]): Promise<Tour[]> {
        return this.touristSpotModel.find({ keywords: { $in: keywords } }).exec();
    }

    async create(tourData: any): Promise<TravelCourse> {
        const createdTour = new this.travelCourseModel(tourData);
        return createdTour.save();
    }

    async importDataFromExcel(filePath: string): Promise<void> {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // `defval` ensures empty cells are not skipped

        jsonData.forEach(async (row) => {
            const tourData = {
                region: row['지역명'],
                courseName: row['코스명'],
                duration: row['여행기간'],
                day1: this.parseDayData(row, '1일차'),
                day2: this.parseDayData(row, '2일차'),
                day3: this.parseDayData(row, '3일차'),
            };
            await this.create(tourData);
        });
    }

    private parseDayData(row: any, dayColumnPrefix: string): any[] {
        const dayData = [];
        const columns = Object.keys(row);  // Get all the column keys

        for (let i = 0; i < columns.length; i++) {
            const columnName = columns[i];

            // Check if the column is for the correct day (e.g., 1일차, 2일차, 3일차)
            if (columnName.startsWith(dayColumnPrefix)) {
                const locationName = row[columnName];
                const idColumn = columns[i + 1];  // ID column should be the next column
                const locationId = row[idColumn];

                // Ensure both location name and ID are present
                if (locationName && locationId) {
                    dayData.push({
                        name: locationName,
                        id: locationId,
                    });
                }
            }
        }

        return dayData;
    }




}
