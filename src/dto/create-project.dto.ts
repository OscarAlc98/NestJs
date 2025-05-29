import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min, MaxLength, MinLength } from 'class-validator';

export class ProjectDTO {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  description: string;

  @IsNumber()
  @Min(1, { message: 'Budget must be greater than 0.' })
  budget: number;

  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  @IsOptional()
  contractSignedOn?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
