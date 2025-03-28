export class CreateJobPostDto {
  title: string;
  description: string;
  location?: string;
  salaryRange?: string;
  isActive?: boolean;
}
