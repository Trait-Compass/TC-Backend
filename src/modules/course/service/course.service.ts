import {Injectable, NotFoundException} from '@nestjs/common';
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {
    Category,
    Keyword,
    keywordMapping,
    Location,
    locationMapping,
    MBTI,
    mbtiKeywords,
    reverseKeywordMapping
} from "../../../common/enums";
import { Location as CourseLocation } from "../../tour/schema/course.schema";
import {PhotoService} from "../../photo/course/service/photo.service";
import {PhotoDto} from "../../photo/course/dto/photo.dto";
import {PcourseQuery} from "../query/pCourse.query";
import {JcourseQuery} from "../query/jCourse.query";
import {Tour, TourDocument} from "../../tour/schema/tour.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {TravelCourse, TravelCourseDocument} from "../../tour/schema/course.schema";
import {JcourseSaveQuery} from "../query/jCourse-save.query";
import {User, UserDocument} from "../../user/schema/user.schema";
import {PcourseSaveRequestDto} from "../dto/pCourse-save";

@Injectable()
export class CourseService {
    constructor(
        private readonly photoService: PhotoService,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(TravelCourse.name) private travelCourseModel: Model<TravelCourseDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
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

    async getSimpleCourse(simpleCourseQuery: SimpleCourseQuery): Promise<TravelCourse[]> {
        return this.findCourses()
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
        const randomIndex = Math.floor(Math.random() * (mbtiValues.length - 1)) + 1;
        return mbtiValues[randomIndex];
    }

    async getPcourse(pcourseQuery: PcourseQuery): Promise<TravelCourse[]> {
        return this.findPCourses(pcourseQuery.location);
    }

    async getJcourse(jcourseQuery: JcourseQuery): Promise<Tour[]> {
        if (!Array.isArray(jcourseQuery.keyword)) {
            jcourseQuery.keyword = [jcourseQuery.keyword];
        }
        return this.findByCodeAndKeywords(locationMapping[jcourseQuery.location], jcourseQuery.keyword);
    }

    async findCourses(): Promise<TravelCourse[]> {
        const courses = await this.travelCourseModel.find().exec();

        for (let i = courses.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [courses[i], courses[j]] = [courses[j], courses[i]];
        }

        const randomCourses = courses.slice(0, 4);

        for (const course of randomCourses) {
            await this.populateLocations(course.day1);
            await this.populateLocations(course.day2);
            await this.populateLocations(course.day3);
        }

        return randomCourses;
    }

    async findPCourses(location: Location): Promise<TravelCourse[]> {
        const courses = await this.travelCourseModel.find({ region: location }).exec();
        const randomCourses = courses.slice(0, 4);

        for (const course of randomCourses) {
            await this.populateLocations(course.day1);
            await this.populateLocations(course.day2);
            await this.populateLocations(course.day3);
        }

        return randomCourses;
    }

    async findByCode(code: number): Promise<Tour[]> {
        return this.tourModel.find({ code }).exec();
    }

    async findByCodeAndKeywords(code: number, keywords: Keyword[]): Promise<Tour[]> {
        const keywordNumbers = keywords.map(keyword => keywordMapping[keyword]);
        return this.tourModel.find({
            code: code,
            keywords: { $in: keywordNumbers }
        }).exec();
    }

    private async populateLocations(locations: CourseLocation[]): Promise<void> {
        for (const location of locations) {
            const tour = await this.tourModel.findOne({ contentId: location.id }).exec();
            if (tour) {
                if (tour.imageUrl) {
                    location.imageUrl = tour.imageUrl;
                } else {
                    location.imageUrl = await this.photoService.getPhoto(tour.title);
                }
                if (tour.keywords) {
                    location.keywords = tour.keywords.map(keywordNumber => reverseKeywordMapping[keywordNumber]);
                }
            }
        }
    }

    async saveJcourse(query: JcourseSaveQuery, userId): Promise<boolean> {
        const travelCourse = await this.travelCourseModel.findById(query.id).exec();

        if (!travelCourse) {
            throw new NotFoundException('존재하지 않는 코스입니다');
        }

        const user = await this.userModel.findById(userId).exec();


        if (!user.courses.includes(travelCourse.id)) {
            user.courses.push(travelCourse.id);
        }

        await user.save();

        await travelCourse.save();

        return true;
    }

    async savePcourse(body: PcourseSaveRequestDto, userId: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).exec();

        const findTourByContentId = async (contentId: number) => {
            const tour = await this.tourModel.findOne({ contentId }).exec();
            if (!tour) {
                console.warn(`Tour with contentId ${contentId} not found`);
            }
            return tour;
        };

        const day1Locations = await Promise.all(
            (body.day1 || []).map(async (location) => {
                const tour = await findTourByContentId(location.contentId);
                return {
                    name: tour?.title || 'Unknown Location',
                    id: location.contentId,
                    imageUrl: tour?.imageUrl || null,
                    keywords: tour?.keywords || [],
                };
            })
        );

        const day2Locations = await Promise.all(
            (body.day2 || []).map(async (location) => {
                const tour = await findTourByContentId(location.contentId);
                return {
                    name: tour?.title || 'Unknown Location',
                    id: location.contentId,
                    imageUrl: tour?.imageUrl || null,
                    keywords: tour?.keywords || [],
                };
            })
        );

        const day3Locations = await Promise.all(
            (body.day3 || []).map(async (location) => {
                const tour = await findTourByContentId(location.contentId);
                return {
                    name: tour?.title || 'Unknown Location',
                    id: location.contentId,
                    imageUrl: tour?.imageUrl || null,
                    keywords: tour?.keywords || [],
                };
            })
        );

        const travelCourse = new this.travelCourseModel({
            user: user._id,
            region: body.region,
            courseName: body.courseName,
            duration: body.duration,
            day1: day1Locations,
            day2: day2Locations,
            day3: day3Locations,
        });

        await travelCourse.save();

        if (!user.courses.includes(travelCourse.id)) {
            user.courses.push(travelCourse.id);
        }

        await user.save();
        return true;
    }






    async getMycourses(id: string): Promise<TravelCourse[]>{
        const user = await this.userModel
            .findById(id)
            .populate({
                path: 'courses',
                model: 'TravelCourse'
            })
            .exec();

        return user.courses as unknown as TravelCourse[];
    }

}
