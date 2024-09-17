import {HttpException, Injectable} from '@nestjs/common';
import axios from 'axios';
import {PhotoDto} from "../dto/photo.dto";
import {getCurrentDate} from "../../../../util/date.util";
import {Location, locationMapping} from "../../../../common/enums";


@Injectable()
export class PhotoService {
    private readonly courseApiUrl = 'http://apis.data.go.kr/B551011/KorService1/areaBasedList1';
    private readonly festivalApiUrl = 'http://apis.data.go.kr/B551011/KorService1/searchFestival1';
    private readonly photoApiUrl = 'https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1';
    async getPhotoList(location: Location, category: string): Promise<PhotoDto> {
        let response;
        try {
            response = await axios.get(this.courseApiUrl, {
                params: {
                    numOfRows: '10',
                    pageNo: '0',
                    MobileOS: 'IOS',
                    MobileApp: 'traitcompass',
                    _type: 'json',
                    listYN: 'Y',
                    arrange: 'A',
                    areaCode: 36,
                    sigunguCode: locationMapping[location],
                    contentTypeId: category,
                    serviceKey: process.env.SERVICE_KEY,
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Unknown error', error.response?.status || 500);
            } else {
                throw new HttpException('Unknown error', 500);
            }
        }

        const items = response.data.response?.body?.items?.item;

        if (!items || items.length === 0) {
            return {
                "city": "양산시",
                "title": "부처의 진신사리 만나러 가는 길",
                "image": "http://tong.visitkorea.or.kr/cms/resource/83/1229083_image2_1.jpg",
                "mbti": "ENFP"
            }
        }

        let selectedItem = null;
        for (const item of items) {
            if (item.firstimage) {
                selectedItem = item;
                break;
            }
        }

        if (!selectedItem) {
            throw new HttpException('No image found', 404);
        }

        return { city: location, title : selectedItem.title, image : selectedItem.firstimage };
    }

    async getFestivalPhotoList(): Promise<PhotoDto[]> {
        let response;
        try {
            response = await axios.get(this.festivalApiUrl, {
                params: {
                    numOfRows: '8',
                    pageNo: '0',
                    MobileOS: 'IOS',
                    MobileApp: 'tc',
                    _type: 'json',
                    listYN: 'Y',
                    eventStartDate: getCurrentDate(),
                    areaCode: '36',
                    serviceKey: process.env.SERVICE_KEY,
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Unknown error', error.response?.status || 500);
            }
        }

        const items = response.data.response?.body?.items?.item;

        if (!items || items.length === 0) {
            return [];
        }
        return  items.map((item: { addr: any; title: any; firstimage: any; }) => {
            return {
                city: item.addr,
                title: item.title,
                image: item.firstimage ?? 'http://tong.visitkorea.or.kr/cms2/website/24/2647324.jpg',
            };
        });
    }

    async getPhoto(keyword: string): Promise<string> {
        let response;
        try {
            response = await axios.get(this.photoApiUrl, {
                params: {
                    numOfRows: '1',
                    pageNo: '0',
                    MobileOS: 'IOS',
                    MobileApp: 'tc',
                    _type: 'json',
                    keyword: keyword,
                    serviceKey: process.env.SERVICE_KEY,
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Unknown error', error.response?.status || 500);
            }
            throw new HttpException('Unexpected error', 500); // Fallback for other errors
        }

        const items = response?.data?.response?.body?.items;

        if (!items || items === "") {
            return 'http://tong.visitkorea.or.kr/cms2/website/50/2761950.jpeg';
        }

        return items?.item?.[0]?.galWebImageUrl ?? ' ';
    }

}
