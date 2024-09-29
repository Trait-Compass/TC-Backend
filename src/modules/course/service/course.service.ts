import {Injectable, NotFoundException} from '@nestjs/common';
import {SimpleCourseQuery} from "../query/simpleCourse.query";
import {
    Category,
    Companion, Keyword,
    keywordMapping,
    Location,
    locationMapping, MBTI,
    mbtiKeywords,
    reverseKeywordMapping, reverseLocationMapping
} from "../../../common/enums";
import {Location as CourseLocation, TravelCourse, TravelCourseDocument} from "../../tour/schema/course.schema";
import {PhotoService} from "../../photo/course/service/photo.service";
import {PhotoDto} from "../../photo/course/dto/photo.dto";
import {PcourseQuery} from "../query/pCourse.query";
import {JcourseQuery} from "../query/jCourse.query";
import {Tour, TourDocument} from "../../tour/schema/tour.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {AIcourseSaveQuery} from "../query/AIcourse.save.query";
import {User, UserDocument} from "../../user/schema/user.schema";
import {JcourseSaveRequestDto} from "../dto/pCourse-save";
import * as dayjs from 'dayjs';
import axios from "axios";
import {GptService} from "../../gpt/gpt.service";

@Injectable()
export class CourseService {
    constructor(
        private readonly photoService: PhotoService,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(TravelCourse.name) private travelCourseModel: Model<TravelCourseDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly gptService: GptService,
    ) {}

    kakaoCarNaviUrl = 'https://apis-navi.kakaomobility.com/v1/waypoints/directions';

    async getFestival(): Promise<PhotoDto[]> {
        return await this.photoService.getFestivalPhotoList();
    }

    async getBestCourse(): Promise<PhotoDto[]> {
        const existingCourses = await this.travelCourseModel
            .find()
            .lean()
            .exec();

        const shuffledCourses = this.shuffleArray(existingCourses);
        const selectedCourses = shuffledCourses.slice(0, 3);

        for (const course of selectedCourses) {
            await this.populateLocations(course.day1);
        }

        return Promise.all(selectedCourses.map(async (course) => await this.mapCourseToPhotoDto(course)));
    }

    private async mapCourseToPhotoDto(course: TravelCourse): Promise<PhotoDto> {
        return {
            mbti: this.findFirstMbtiForKeyword(course.day1[0].keywords[0]),
            city: course.region,
            title: course.courseName,
            image: course.day1[0]?.imageUrl || await this.photoService.getPhoto(course.day1[0].name),
        };
    }

    private findFirstMbtiForKeyword(keyword: Keyword): MBTI {
        for (const mbti of Object.keys(mbtiKeywords)) {
            if (mbtiKeywords[mbti as MBTI].includes(keywordMapping[keyword])) {
                return mbti as MBTI;
            }
        }
        return null;
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

    async getPcourse(pcourseQuery: PcourseQuery): Promise<TravelCourse[]> {
        return this.getOrCreateCourses(pcourseQuery);
    }

    async getJcourse(jcourseQuery: JcourseQuery): Promise<TravelCourse[]> {
        return this.getOrCreateCourses(jcourseQuery);
    }

    async getSimpleCourses(simpleCourseQuery: SimpleCourseQuery): Promise<TravelCourse[]> {
        return this.getOrCreateCourses(simpleCourseQuery);
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

    async saveAIcourse(query: AIcourseSaveQuery, userId): Promise<boolean> {
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

    async saveJcourse(body: JcourseSaveRequestDto, userId: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).exec();

        const day1Locations = await this.getLocationsForDay(body.day1);
        const day2Locations = await this.getLocationsForDay(body.day2);
        const day3Locations = await this.getLocationsForDay(body.day3);
        const day4Locations = await this.getLocationsForDay(body.day4);
        const day5Locations = await this.getLocationsForDay(body.day5);

        const durationDays = [day1Locations, day2Locations, day3Locations, day4Locations, day5Locations].filter(
            (day) => day.length > 0
        ).length;

        let duration: string;
        switch (durationDays) {
            case 1:
                duration = '당일치기';
                break;
            case 2:
                duration = '1박 2일';
                break;
            case 3:
                duration = '2박 3일';
                break;
            case 4:
                duration = '3박 4일';
                break;
            case 5:
                duration = '4박 5일';
                break;
            default:
                duration = 'Unknown Duration';
        }

        const allKeywords = [
            ...day1Locations.flatMap((location) => location.keywords),
            ...day2Locations.flatMap((location) => location.keywords),
            ...day3Locations.flatMap((location) => location.keywords),
            ...day4Locations.flatMap((location) => location.keywords),
            ...day5Locations.flatMap((location) => location.keywords),
        ];

        const keywordsStringList = allKeywords.join(', ');

        const courseName = await this.gptService.generateCourseNameFromKeywords(keywordsStringList);

        const travelCourse = new this.travelCourseModel({
            user: user.id,
            region: reverseLocationMapping[body.code],
            courseName,
            duration,
            day1: day1Locations,
            day2: day2Locations,
            day3: day3Locations,
            day4: day4Locations,
            day5: day5Locations,
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
                model: 'TravelCourse',
                select: '-day1 -day2 -day3 -day4 -day5'
            })
            .lean()
            .exec();

        return user.courses as unknown as TravelCourse[];
    }

    async getMycourse(userId: string, courseId: string): Promise<TravelCourse[]>{
        const user = await this.userModel
            .findById(userId)
            .populate({
                path: 'courses',
                model: 'TravelCourse',
                match: { _id: courseId }
            })
            .lean()
            .exec();

        if (!user.courses || !Array.isArray(user.courses)) {
            throw new Error('Courses not found for this user');
        }

        await Promise.all(
            (user.courses as unknown as TravelCourse[]).map(course =>
                Promise.all(
                    Object.keys(course)
                        .filter(key => key.startsWith('day') && Array.isArray(course[key]) && course[key].length > 0)
                        .map(dayKey =>
                            Promise.all([
                                this.populateLocations(course[dayKey]),
                                this.calculateTravelTimes(course[dayKey]),
                            ])
                        )
                )
            )
        );
        return user.courses as unknown as TravelCourse[]
    }

    async findTourByContentId(contentId: number): Promise<Tour | null> {
        const tour = await this.tourModel.findOne({ contentId }).exec();
        if (!tour) {
            console.warn(`Tour with contentId ${contentId} not found`);
        }
        return tour;
    }

    async getLocationsForDay(dayLocations: Array<{ contentId: number }>): Promise<Array<{ name: string; id: number; imageUrl: string | null; keywords: number[] }>> {
        return Promise.all(
            (dayLocations || []).map(async (location) => {
                const tour = await this.findTourByContentId(location.contentId);
                return {
                    name: tour?.title || 'Unknown Location',
                    id: location.contentId,
                    imageUrl: tour?.imageUrl || null,
                    keywords: tour?.keywords || [],
                };
            })
        );
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

    async getOrCreateCourses(query: PcourseQuery | JcourseQuery | SimpleCourseQuery): Promise<TravelCourse[]> {

        const start = dayjs(query.startDate);
        const end = dayjs(query.endDate);
        const totalDays = end.diff(start, 'day') + 1;
        let existingCourses: TravelCourse[];

        if ('location' in query) {
            existingCourses = await this.travelCourseModel
                .find({
                    region: query.location,
                    duration: this.getDurationText(totalDays),
                })
                .lean()
                .exec() as TravelCourse[];
        } else {
            existingCourses = await this.travelCourseModel
                .find({
                    duration: this.getDurationText(totalDays),
                })
                .lean()
                .exec() as TravelCourse[];
        }

        let randomCourses = existingCourses.slice(0, 4);

        if (randomCourses.length < 4) {
            const coursesToGenerate = 4 - randomCourses.length;

            const newCourses = await Promise.all(
                Array(coursesToGenerate).fill(null).map(() => this.generateTravelCourse(query, totalDays))
            );

            const createdCourses = await Promise.all(
                newCourses.map(course => new this.travelCourseModel(course).save())
            );

            randomCourses = [...randomCourses, ...createdCourses];
        }

        await Promise.all(
            randomCourses.map(course =>
                Promise.all(
                    Array.from({ length: totalDays }, (_, index) => {
                        const dayKey = `day${index + 1}`;
                        return Promise.all([
                            this.populateLocations(course[dayKey]),
                            this.calculateTravelTimes(course[dayKey]),
                        ]);
                    })
                )
            )
        );

        return randomCourses;
    }


    private async generateTravelCourse(query: PcourseQuery | JcourseQuery | SimpleCourseQuery, totalDays: number): Promise<TravelCourse> {
        let matchingTours: Tour[];

        if ('keyword' in query) {
            matchingTours = await this.tourModel.find({
                code: locationMapping[query.location],
                keywords: { $in: query.keyword.map(kw => keywordMapping[kw]) }
            }).lean().exec();
        } else if ('location' in query) {
            matchingTours = await this.tourModel.find({
                code: locationMapping[query.location],
                keywords: { $in: mbtiKeywords[query.mbti] }
            }).lean().exec();
        } else {
            matchingTours = await this.tourModel.find().lean().exec();
        }

        const startingLocations = this.pickRandomTours(matchingTours, totalDays);

        return this.buildTravelCourse(startingLocations, query, totalDays);
    }


    private async buildTravelCourse(startingLocations: Tour[], query: JcourseQuery | PcourseQuery | SimpleCourseQuery , totalDays: number): Promise<TravelCourse> {

        let location;

        if ('location' in query) {
            location = query.location;
        } else {
            location = this.getRandomLocation();
        }

        const titles = startingLocations
            .flatMap((location) => location.title)
            .slice(0, 3)

        const titleString = `["${titles.join('", "')}"]`;

        const courseName = await this.gptService.generateCourseNameFromKeywords(titleString);

        const travelCourse: TravelCourse = {
            region: location,
            courseName: courseName,
            duration: this.getDurationText(totalDays),
            day1: [],
            day2: [],
            day3: [],
            day4: [],
            day5: [],
        };

        let placesPerDayRange;
        if('companion' in query){
            placesPerDayRange = this.getPlacesPerDayRange(query.companion);
        } else {
            placesPerDayRange = [2,3];
        }

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

                travelCourse[`day${index + 1}`] = dayLocations;
            })
        );

        return travelCourse;
    }

    private getDurationText(totalDays: number): string {
        if (totalDays === 1) {
            return '당일치기';
        }
        return `${totalDays - 1}박 ${totalDays}일`;
    }

    private getPlacesPerDayRange(companion: Companion): [number, number] {
        switch (companion) {
            case Companion.COUPLE:
            case Companion.WITH_CHILD:
            case Companion.WITH_PARENTS:
                return [1, 2];
            default:
                return [2, 3];
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
            keywords: tour.keywords.map(keywordNumber => reverseKeywordMapping[keywordNumber]),
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

    private getRandomLocation(): Location {
        const locations = Object.values(Location);
        const randomIndex = Math.floor(Math.random() * locations.length);
        return locations[randomIndex];
    }
}
