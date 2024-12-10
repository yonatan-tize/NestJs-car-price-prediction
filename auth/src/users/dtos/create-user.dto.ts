import { IsEmail, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto{
    @IsEmail()
    @IsString()
    email: string;

    @IsStrongPassword()
    password: string;
}