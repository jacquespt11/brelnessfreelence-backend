import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  type!: string; // "RENEWAL", "TECHNICAL", "OTHER"

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class UpdateTicketStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string; // "PENDING", "IN_PROGRESS", "RESOLVED"
}
