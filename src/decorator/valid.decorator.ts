import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";
import {SignupRequest} from "../modules/user/dto/request/signup.request";

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
                        return true; // Allow empty password for OAuth users
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
