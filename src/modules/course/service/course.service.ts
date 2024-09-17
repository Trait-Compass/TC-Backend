import {Injectable, NotFoundException} from '@nestjs/common';
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {
    Category,
    Companion,
    Keyword,
    keywordMapping,
    Location,
    locationMapping,
    MBTI,
    mbtiKeywords,
    reverseKeywordMapping
} from "../../../common/enums";
import {Location as CourseLocation, TravelCourse, TravelCourseDocument} from "../../tour/schema/course.schema";
import {PhotoService} from "../../photo/course/service/photo.service";
import {PhotoDto} from "../../photo/course/dto/photo.dto";
import {PcourseQuery} from "../query/pCourse.query";
import {JcourseQuery} from "../query/jCourse.query";
import {Tour, TourDocument} from "../../tour/schema/tour.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {JcourseSaveQuery} from "../query/jCourse-save.query";
import {User, UserDocument} from "../../user/schema/user.schema";
import {PcourseSaveRequestDto} from "../dto/pCourse-save";
import * as dayjs from 'dayjs';
import axios from "axios";

@Injectable()
export class CourseService {
    constructor(
        private readonly photoService: PhotoService,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(TravelCourse.name) private travelCourseModel: Model<TravelCourseDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    kakaoCarNaviUrl = 'https://apis-navi.kakaomobility.com/v1/waypoints/directions';

    async getFestival(): Promise<PhotoDto[]> {
        const mappedCodeList = await this.getRandomCodeMappings();
        return await this.photoService.getFestivalPhotoList();
    }

    async getBestCourse(): Promise<PhotoDto[]> {
        const mappedLocationCategoryList = await this.getMappedLocationsAndCategories()
        const dataArrays = await Promise.all(Object.entries(mappedLocationCategoryList).map(async ([location, category]) => {
            const photo = await this.photoService.getPhotoList(location as Location, category);
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

        return randomLocations.reduce((acc, location, index) => {
            acc[Location[location]] = Category[randomCategories[index]];
            return acc;
        }, {} as Record<Location, Category>);
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
        return this.findPCourses(pcourseQuery);
    }

    // TODO 임시 로직
    async getJcourse(jcourseQuery: JcourseQuery): Promise<TravelCourse[]> {
        return this.findPCourses(jcourseQuery);
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
        await Promise.all(
            locations.map(async (location) => {
                const tour = await this.tourModel.findOne({ contentId: location.id }).exec();
                if (tour) {
                    location.imageUrl = tour.imageUrl || await this.photoService.getPhoto(tour.title);
                    location.keywords = tour.keywords.map(keywordNumber => reverseKeywordMapping[keywordNumber]);
                }
            })
        );
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

    private async calculateTravelTimes(locations: CourseLocation[]): Promise<void> {
        if (locations.length < 2) return;

        await Promise.all(
            locations.slice(0, -1).map(async (start, i) => {
                const end = locations[i + 1];
                start.travelInfoToNext = await this.getTravelTimeBetweenLocations(start, end);
            })
        );
    }

    private async getTravelTimeBetweenLocations(start: CourseLocation, end: CourseLocation): Promise<any> {
        const startTour = await this.tourModel.findOne({ contentId: start.id }).exec();
        const endTour = await this.tourModel.findOne({ contentId: end.id }).exec();

        if (!startTour || !endTour) {
            console.error(`Locations not found for startId: ${start.id} or endId: ${end.id}`);
            return {
                car: 'N/A',
                walk: 'N/A',
            };
        }

        const headers = {
            'Authorization': `KakaoAK ${process.env.KAKAO_KEY}`,
            'Content-Type': 'application/json',
        };

        const data = {
            origin: { x: startTour.location.coordinates[0], y: startTour.location.coordinates[1] },
            destination: { x: endTour.location.coordinates[0], y: endTour.location.coordinates[1] },
            waypoints: [],
            priority: 'RECOMMEND',
            car_fuel: 'GASOLINE',
            car_hipass: false,
            alternatives: false,
            road_details: false,
        };

        try {
            const response = await axios.post(this.kakaoCarNaviUrl, data, { headers });
            const carTime = Math.floor(response.data.routes[0]?.summary?.duration);
            const carDistance = response.data.routes[0]?.summary?.distance;

            const walkingTime = Math.floor(carDistance / 1.29);


            if(carDistance === undefined) {
                return {
                    distance: '측정 불가',
                };
            }

            return {
                distance: this.formatDistance(carDistance),
                carTime: this.formatTime(carTime),
                walkingTime: this.formatTime(walkingTime),
            };
        } catch (error) {
            console.error('Error fetching travel time from Kakao API', error);
            return {
                car: 'N/A',
                walk: 'N/A',
            };
        }
    }

    formatTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h > 0 ? h + '시간 ' : ''}${m > 0 ? m + '분' : ''}`.trim();
    }

    formatDistance(meters: number): string {
        if (meters >= 1000) {
            return (meters / 1000).toFixed(1) + 'km';
        } else {
            return meters + 'm';
        }
    }

    async findPCourses(pcourseQuery: PcourseQuery): Promise<TravelCourse[]> {

        const start = dayjs(pcourseQuery.startDate);
        const end = dayjs(pcourseQuery.endDate);
        const totalDays = end.diff(start, 'day');

        const existingCourses = await this.travelCourseModel
            .find({ region: pcourseQuery.location })
            .lean()
            .exec() as TravelCourse[];

        let randomCourses = existingCourses.slice(0, 4);

        if (randomCourses.length < 4) {
            const coursesToGenerate = 4 - randomCourses.length;

            const newCourses = await Promise.all(
                Array(coursesToGenerate).fill(null).map(() => this.generateTravelCourse(pcourseQuery)
            ));

            randomCourses = [...randomCourses, ...newCourses];
        }

        for (const course of randomCourses) {
            await Promise.all([
                this.populateLocations(course.day1),
                this.populateLocations(course.day2),
                this.populateLocations(course.day3),
                this.calculateTravelTimes(course.day1),
                this.calculateTravelTimes(course.day2),
                this.calculateTravelTimes(course.day3),
            ]);
        }
        return randomCourses;
    }

    private async generateTravelCourse(query: PcourseQuery): Promise<TravelCourse> {

        const start = dayjs(query.startDate);
        const end = dayjs(query.endDate);
        const totalDays = end.diff(start, 'day')+1;

        const matchingTours = await this.tourModel.find({
            code: locationMapping[query.location],
            keywords: { $in: mbtiKeywords[query.mbti] }
        }).lean().exec();

        const startingLocations = this.pickRandomTours(matchingTours, totalDays);

        return await this.buildTravelCourse(startingLocations, query, totalDays);
    }

    private async buildTravelCourse(startingLocations: Tour[], query: PcourseQuery, totalDays: number): Promise<TravelCourse> {
        const travelCourse: TravelCourse = {
            region: query.location,
            courseName: `${query.location} ${this.getDurationText(totalDays)} 여행 코스`,
            duration: this.getDurationText(totalDays),
            day1: [],
            day2: [],
            day3: [],
        };

        const placesPerDayRange = this.getPlacesPerDayRange(query.companion);

        await Promise.all(
            startingLocations.map(async (startLocation, index) => {
                const dayLocations = [this.mapTourToLocation(startLocation)];
                const placeCount = this.getRandomPlacesCount(placesPerDayRange);

                for (let j = 0; j < placeCount - 1; j++) {
                    const nearbyLocations = await this.findNearbyLocations(startLocation.location.coordinates, 10000, startLocation.contentId);
                    const nextLocation = this.shuffleArray(nearbyLocations).slice(0, 1)[0];
                    dayLocations.push(this.mapTourToLocation(nextLocation));
                    startLocation = nextLocation;
                }

                switch (index) {
                    case 0:
                        travelCourse.day1 = dayLocations;
                        break;
                    case 1:
                        travelCourse.day2 = dayLocations;
                        break;
                    case 2:
                        travelCourse.day3 = dayLocations;
                        break;
                }
            })
        );

        return travelCourse;
    }

    private getDurationText(totalDays: number): string {
        const durationTextMap = {
            0: '당일치기',
            1: '1박 2일',
            2: '2박 3일',
            3: '3박 4일'
        };
        return durationTextMap[totalDays] || `${totalDays}일`;
    }

    private getPlacesPerDayRange(companion: Companion): [number, number] {
        switch (companion) {
            case Companion.ALONE:
            case Companion.FRIEND:
            case Companion.FRIENDS:
                return [2, 3];
            case Companion.COUPLE:
            case Companion.WITH_CHILD:
            case Companion.WITH_PARENTS:
                return [1, 2];
            default:
                return [1, 2];
        }
    }

    private getRandomPlacesCount(range: [number, number]): number {
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }


    private mapTourToLocation(tour: Tour): CourseLocation {
        return {
            name: tour.title,
            id: tour.contentId,
            imageUrl: tour.imageUrl,
            keywords: tour.keywords as any,
            travelInfoToNext: null
        };
    }

    private async findNearbyLocations(startLocation: [number, number], maxDistanceInMeters: number, excludeId: number): Promise<Tour[]> {
        return await this.tourModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: startLocation
                    },
                    $maxDistance: maxDistanceInMeters,
                }
            },
            contentId: { $ne: excludeId }
        }).lean().exec();
    }

    private pickRandomTours(tours: Tour[], totalDays: number): Tour[] {
        const shuffledTours = tours.sort(() => 0.5 - Math.random());
        return shuffledTours.slice(0, totalDays);
    }

    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
