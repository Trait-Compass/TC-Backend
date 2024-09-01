import {HttpException, Injectable} from '@nestjs/common';
import axios from 'axios';
import {PhotoDto} from "../dto/photo.dto";
import {getCurrentDate} from "../../../../util/date.util";


@Injectable()
export class PhotoService {
    private readonly courseApiUrl = 'http://apis.data.go.kr/B551011/KorService1/searchKeyword1';
    private readonly festivalApiUrl = 'http://apis.data.go.kr/B551011/KorService1/searchFestival1';
    private readonly photoApiUrl = 'https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1';
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
            throw new HttpException('No festival found', 404);
        }
        return  items.map((item: { addr: any; title: any; firstimage: any; }) => {
            return {city: item.addr, title: item.title, image: item.firstimage};
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
        }

        if( response.data.response.body.items == ""){
            return 'http://tong.visitkorea.or.kr/cms2/website/50/2761950.jpeg';
        } else {
            return response.data.response.body.items?.item[0]?.galWebImageUrl ?? " ";
        }


    }
}
