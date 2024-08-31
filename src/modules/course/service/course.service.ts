import {Injectable} from '@nestjs/common';
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {Category, Location, locationMapping, MBTI} from "../../../common/enums";
import {PhotoService} from "../../photo/course/service/photo.service";
import {PhotoDto} from "../../photo/course/dto/photo.dto";
import {PcourseQuery} from "../query/pCourse.query";
import {JcourseQuery} from "../query/jCourse.query";

@Injectable()
export class CourseService {
    constructor(
        private readonly photoService: PhotoService
    ) {}

    async getFestival(): Promise<PhotoDto[]> {
        const mappedCodeList = await this.getRandomCodeMappings();
        return await this.photoService.getFestivalPhotoList();
    }
    // TODO 로직 적용
    async getBestCourse(): Promise<PhotoDto[]> {
        const mappedLocationCategoryList = await this.getMappedLocationsAndCategories()
        const dataArrays = await Promise.all(Object.entries(mappedLocationCategoryList).map(async ([location, category]) => {
            const photo = await this.photoService.getPhotoList(location as string, category as string);
            photo.mbti = await this.getRandomMBTI() as string;
            return photo;
        }));
        return dataArrays.flat();
    }

    async getSimpleCourse(simpleCourseQuery: SimpleCourseQuery): Promise<PhotoDto[]> {
        const mappedLocationCategoryList = await this.getMappedLocationsAndCategories();
        const dataArrays = await Promise.all(Object.entries(mappedLocationCategoryList).map(async ([location, category]) => {
            return await this.photoService.getPhotoList(location as string, category as string);
        }));
        return dataArrays.flat();
    }

    async getMappedLocationsAndCategories(): Promise<Record<Location , Category>> {
        const locationKeys = Object.keys(Location) as Array<keyof typeof Location>;
        const categories = Object.keys(Category) as Array<keyof typeof Category>;

        const randomLocations = await this.getRandomUniqueElements(locationKeys, 4);
        const randomCategories = await this.getRandomElements(categories, 4);

        const locationMap = randomLocations.reduce((acc, location, index) => {
            acc[Location[location]] = Category[randomCategories[index]];
            return acc;
        }, {} as Record<Location, Category>);

        return locationMap;
    }


    async getRandomElements<T>(array: T[], count: number): Promise<T[]> {
        const result: T[] = [];

        while (result.length < count) {
            const randomIndex = Math.floor(Math.random() * array.length);
            result.push(array[randomIndex]);
        }

        return result;
    }

    async getRandomUniqueElements<T>(array: T[], count: number): Promise<T[]> {
        const result: T[] = [];
        const taken = new Set<number>();

        while (result.length < count) {
            const randomIndex = Math.floor(Math.random() * array.length);
            if (!taken.has(randomIndex)) {
                taken.add(randomIndex);
                result.push(array[randomIndex]);
            }
        }
        return result;
    }

    async getRandomCodeMappings(): Promise<Record<string, number>> {
        const locationKeys = Object.keys(Location) as Array<keyof typeof Location>;

        const randomLocations = await this.getRandomUniqueElements(locationKeys, 4);

        const result: Record<string, number> = {};

        randomLocations.forEach((location) => {
            result[Location[location]] = locationMapping[Location[location]];
        });

        return result;
    }

    async getRandomMBTI(): Promise<MBTI> {
        const mbtiValues = Object.values(MBTI);
        const randomIndex = Math.floor(Math.random() * mbtiValues.length);
        return mbtiValues[randomIndex];
    }

    async getPcourse(pcourseQuery: PcourseQuery): Promise<PhotoDto[]> {
        const mappedLocationCategoryList = await this.getMappedLocationsAndCategories();
        const dataArrays = await Promise.all(Object.entries(mappedLocationCategoryList).map(async ([location, category]) => {
            return await this.photoService.getPhotoList(location as string, category as string);
        }));
        return dataArrays.flat();
    }

    async getJcourse(jcourseQuery: JcourseQuery): Promise<PhotoDto[]> {
        const mappedLocationCategoryList = await this.getMappedLocationsAndCategories();
        const dataArrays = await Promise.all(Object.entries(mappedLocationCategoryList).map(async ([location, category]) => {
            return await this.photoService.getPhotoList(location as string, category as string);
        }));
        return dataArrays.flat();
    }

}
