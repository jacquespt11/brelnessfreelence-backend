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

  @ApiPropertyOptional({ example: 'Couleur bleue souhaitée' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ example: 'variant-uuid' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiPropertyOptional({ example: '2026-04-01T10:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  bookingDate?: Date;

  @ApiPropertyOptional({ example: '14:00' })
  @IsOptional()
  @IsString()
  bookingSlot?: string;

  @ApiPropertyOptional({ example: 'PROMO20' })
  @IsOptional()
  @IsString()
  discountCode?: string;
}

export class UpdateReservationStatusDto {
  @ApiProperty({ enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;
}
