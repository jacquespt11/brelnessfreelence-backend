import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  code: string;

  @IsEnum(['PERCENT', 'FIXED'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minAmount?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUses?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdateDiscountDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(['PERCENT', 'FIXED'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minAmount?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUses?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
