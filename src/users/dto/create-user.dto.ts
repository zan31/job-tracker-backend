export class CreateUserDto {
  email: string;
  passwordHash: string;
  fullName: string;
  cvUrl?: string;
  companyId?: number;
}
