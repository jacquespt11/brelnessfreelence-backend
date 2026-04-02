import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../auth/subscription.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ── Public ─────────────────────────────────────────────────
  @ApiOperation({ summary: 'Get all products of a shop (public catalog)' })
  @ApiQuery({ name: 'search', required: false })
  @Get('shop/:shopId')
  findByShop(
    @Param('shopId') shopId: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findByShop(shopId, search);
  }

  @ApiOperation({ summary: 'Get a single product (public)' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id, true);
  }

  // ── Shop Admin ─────────────────────────────────────────────
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Post()
  create(@Request() req: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(req.user.shopId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own product (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, req.user.shopId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own product (SHOP_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.productsService.remove(id, req.user.shopId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload product image (SHOP_ADMIN)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseGuards(AuthGuard('jwt'), RolesGuard, SubscriptionGuard)
  @Roles('SHOP_ADMIN')
  @Post(':id/image')
  async uploadImage(
    @Param('id') id: string,
    @Req() req: any,
    @Request() authReq: any,
  ) {
    // Basic authorization check: verify the product belongs to the user
    const product = await this.productsService.findOne(id);
    if (product.shopId !== authReq.user.shopId) {
      throw new BadRequestException('Accès refusé');
    }

    // With attachFieldsToBody, the file is available on req.body.file
    const fileField = req.body?.file;
    if (!fileField) throw new BadRequestException('Le fichier est manquant');

    // fileField is a multipart file object with a toBuffer() method
    const buffer = Buffer.isBuffer(fileField)
      ? fileField
      : Buffer.from(fileField.value ?? fileField, 'base64');

    // Upload to Cloudinary
    const result = await this.cloudinaryService.uploadImage(buffer);

    // Append the new image URL to the product's images array
    const updatedImages = [...product.images, result.secure_url];

    // Update the product
    return this.productsService.update(id, authReq.user.shopId, { images: updatedImages });
  }

  // ── Super Admin ────────────────────────────────────────────
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all products across all shops (SUPER_ADMIN)' })
  @ApiQuery({ name: 'search', required: false })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin update any product (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch('admin/:id')
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.adminUpdate(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin delete any product (SUPER_ADMIN)' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete('admin/:id')
  adminRemove(@Param('id') id: string) {
    return this.productsService.adminRemove(id);
  }
}
