import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateReservationDto {
  @ApiProperty({ example: 'prod-uuid' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @ApiProperty({ example: '+243000000000' })
  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @ApiPropertyOptional({ example: 'jean.dupont@example.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateReservationStatusDto {
  @ApiProperty({ enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;
}
