import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {SignupRequest} from "../modules/user/dto/request/signup.request";
import * as dayjs from "dayjs";

export function IsPasswordValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPasswordValid',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const signupRequest = args.object as SignupRequest;
                    if (signupRequest.isOauth) {
                        return true;
                    }
                    return value && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Password too weak';
                }
            },
        });
    };
}

@ValidatorConstraint({ async: false })
export class DateRangeConstraint implements ValidatorConstraintInterface {
    validate(endDate: string, args: any) {
        const { object } = args;
        const startDate = object.startDate;
        const daysDifference = dayjs(endDate).diff(dayjs(startDate), 'day');
        return daysDifference + 1 <= 5;
    }

    defaultMessage() {
        return '날짜 선택은 5일 이하로만 가능합니다';
    }
}

export function DateRange(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: DateRangeConstraint,
        });
    };
}
