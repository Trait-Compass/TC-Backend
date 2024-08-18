import {Module} from '@nestjs/common';
import {ExelController} from "./exel.controller";
import {ExcelService} from "./exel.service";
import {TourModule} from "../tour/tour.module";

@Module({
  imports: [TourModule],
  controllers: [ExelController],
  providers: [ExcelService],
})
export class ExelModule {}
