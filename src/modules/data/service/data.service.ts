import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { format } from '@fast-csv/format';

@Injectable()
export class DataService {
    private readonly apiUrl = 'https://apis.data.go.kr/B551011/KorService1/areaBasedList1';
    private readonly detailUrl = 'https://apis.data.go.kr/B551011/KorService1/detailIntro1';
    private readonly apiKey = '+LyqFE/M7h+t8Otc5Xmd8o0HEXk6ssL2BjY89nUsJ2xx1x30csAyRnYjk5be7Ubynl9FZXMfUeBNtoRDJKEU/A==';

    async fetchDataAndGenerateCSV(): Promise<void> {
        const numOfPages = 40;
        const data = [];

        for (let pageNo = 1; pageNo <= numOfPages; pageNo++) {
            const response = await axios.get(this.apiUrl, {
                params: {
                    numOfRows: 100,
                    pageNo,
                    MobileOS: 'IOS',
                    MobileApp: 'tc',
                    _type: 'json',
                    areaCode: 36,
                    serviceKey: this.apiKey,
                },
            });

            const items = response.data.response.body.items.item;

            for (const item of items) {
                const detailResponse = await axios.get(this.detailUrl, {
                    params: {
                        MobileOS: 'IOS',
                        MobileApp: 'tc',
                        _type: 'json',
                        contentId: item.contentid,
                        contentTypeId: item.contenttypeid,
                        numOfRows: 1,
                        serviceKey: this.apiKey,
                    },
                });

                const detailItem = detailResponse?.data?.response?.body?.items?.item?.[0];
                const mergedItem = { ...item, ...detailItem };
                data.push(mergedItem);
            }
        }

        this.convertToCSV(data);
    }

    private convertToCSV(data: any[]): void {
        const ws = fs.createWriteStream('output.csv');
        const csvStream = format({ headers: true });

        ws.write('\uFEFF');
        csvStream.pipe(ws).on('end', () => process.exit());

        data.forEach(item => {
            csvStream.write(item);
        });

        csvStream.end();
    }
}
