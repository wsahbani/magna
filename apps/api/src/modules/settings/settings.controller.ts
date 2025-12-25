import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingResponseDto } from './dto/setting-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll(@Query('category') category?: string) {
    const settings = await this.settingsService.findAll(category, true);
    return settings.map((s) => SettingResponseDto.fromEntity(s, true));
  }

  @Get('public')
  async findPublicSettings(@Query('category') category?: string) {
    const settings = await this.settingsService.findAll(category, false);
    return settings.map((s) => SettingResponseDto.fromEntity(s, true));
  }

  @Get('categories')
  @UseGuards(AdminGuard)
  async getCategories() {
    return this.settingsService.getCategories();
  }

  @Get('category/:category')
  @UseGuards(AdminGuard)
  async findByCategory(@Param('category') category: string) {
    const settings = await this.settingsService.findByCategory(category, true);
    return settings.map((s) => SettingResponseDto.fromEntity(s, true));
  }

  @Get(':key')
  @UseGuards(AdminGuard)
  async findOne(@Param('key') key: string) {
    const setting = await this.settingsService.findOne(key, true);
    return SettingResponseDto.fromEntity(setting, true);
  }

  @Get(':key/decrypted')
  @UseGuards(AdminGuard)
  async getDecryptedValue(@Param('key') key: string) {
    const value = await this.settingsService.getDecryptedValue(key);
    return { key, value };
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createSettingDto: CreateSettingDto) {
    const setting = await this.settingsService.create(createSettingDto);
    return SettingResponseDto.fromEntity(setting, true);
  }

  @Put(':key')
  @UseGuards(AdminGuard)
  async update(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    const setting = await this.settingsService.update(key, updateSettingDto);
    return SettingResponseDto.fromEntity(setting, true);
  }

  @Delete(':key')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('key') key: string) {
    await this.settingsService.delete(key);
  }
}
