import {Injectable} from '@nestjs/common';
import {SimpleCourseRequest} from "../dto/request/simpleCourse.request";
import {Category, Cities, cityMapping, Counties, countyMapping} from "../../../common/enums";
import {PhotoService} from "../../photo/course/service/photo.service";
import {PhotoDto} from "../../photo/course/dto/photo.dto";

@Injectable()
export class CourseService {
    constructor(
        private readonly photoService: PhotoService
    ) {}

    async getFestival(): Promise<PhotoDto[]> {
        const mappedCodeList = await this.getRandomCodeMappings();
        return await this.photoService.getFestivalPhotoList();
    }

    async getSimpleCourse(simpleCourseRequest: SimpleCourseRequest): Promise<PhotoDto[]> {
        const mappedCityCategoryList = await this.getMappedCitiesAndCategories();
        const dataArrays = await Promise.all(Object.entries(mappedCityCategoryList).map(async ([city, category]) => {
            return await this.photoService.getPhotoList(city as string, category as string);
        }));
        return dataArrays.flat();
    }

    async getMappedCitiesAndCategories(): Promise<Record<Cities , Category>> {
        const cityKeys = Object.keys(Cities) as Array<keyof typeof Cities>;
        const countyKeys = Object.keys(Counties) as Array<keyof typeof Counties>;
        const categories = Object.keys(Category) as Array<keyof typeof Category>;

        const randomCities = await this.getRandomUniqueElements(cityKeys, 2);
        const randomCategories1 = await this.getRandomElements(categories, 2);

        const cityMap = randomCities.reduce((acc, city, index) => {
            acc[Cities[city]] = Category[randomCategories1[index]];
            return acc;
        }, {} as Record<Cities, Category>);

        return cityMap;
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

    async getRandomCodeMappings(): Promise<Record<string, string>> {
        const cityKeys = Object.keys(Cities) as Array<keyof typeof Cities>;
        const countyKeys = Object.keys(Counties) as Array<keyof typeof Counties>;

        const randomCities = await this.getRandomUniqueElements(cityKeys, 2);
        const randomCounties = await this.getRandomUniqueElements(countyKeys, 2);

        const result: Record<string, string> = {};

        randomCities.forEach((city) => {
            result[Cities[city]] = cityMapping[Cities[city]];
        });

        randomCounties.forEach((county) => {
            result[Counties[county]] = countyMapping[Counties[county]];
        });

        return result;
    }

}
