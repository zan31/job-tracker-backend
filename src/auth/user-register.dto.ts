import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsStrongPassword(
    {},
    {
      message: 'Password must include uppercase, lowercase, number, and symbol',
    },
  )
  passwordHash: string;
  @IsString()
  @IsNotEmpty()
  fullName: string;
  cvUrl?: string;
  companyId?: number;
}
