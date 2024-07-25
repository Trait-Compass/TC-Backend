import {HttpException, Injectable} from '@nestjs/common';
import axios from 'axios';
import {PhotoDto} from "../dto/photo.dto";
import {getCurrentDate} from "../../../../util/date.util";


@Injectable()
export class PhotoService {
    private readonly courseApiUrl = 'http://apis.data.go.kr/B551011/KorService1/searchKeyword1';
    private readonly festivalApiUrl = 'http://apis.data.go.kr/B551011/KorService1/searchFestival1';
    private readonly serviceKey = '+LyqFE/M7h+t8Otc5Xmd8o0HEXk6ssL2BjY89nUsJ2xx1x30csAyRnYjk5be7Ubynl9FZXMfUeBNtoRDJKEU/A==';
    async getPhotoList(city: string, category: string): Promise<PhotoDto> {
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
                    contentTypeId: category,
                    keyword: city,
                    serviceKey: this.serviceKey,
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
            throw new HttpException('No course found', 404);
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

        return { city, title : selectedItem.title, image : selectedItem.firstimage };
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
                    serviceKey: this.serviceKey,
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpException(error.response?.data || 'Unknown error', error.response?.status || 500);
            }
        }

        const items = response.data.response?.body?.items?.item;

        if (!items || items.length === 0) {
            throw new HttpException('No festival found', 404);
        }
        return  items.map((item: { addr: any; title: any; firstimage: any; }) => {
            return {city: item.addr, title: item.title, image: item.firstimage};
        });
    }
}
