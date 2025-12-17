import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SipocService } from '../services/sipoc.service';
import { CreateElementDto } from '../dto/create-element.dto';
import { UpdateElementDto } from '../dto/update-element.dto';
import { ReorderElementsDto } from '../dto/reorder-elements.dto';

@Controller('sipoc/:sipocId/elements')
export class SipocElementsController {
  constructor(private readonly sipocService: SipocService) {}

  @Get()
  async findAll(@Param('sipocId') sipocId: string) {
    return this.sipocService.findElements(sipocId);
  }

  @Get('similar/:title')
  async findSimilar(
    @Param('sipocId') sipocId: string,
    @Param('title') title: string,
    @Query('threshold') threshold?: number,
  ) {
    const similarityThreshold = threshold ? Number(threshold) : 0.3;
    return this.sipocService.findSimilarElements(
      decodeURIComponent(title),
      sipocId,
      similarityThreshold,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createElementDto: CreateElementDto) {
    return this.sipocService.createElement(createElementDto);
  }

  @Put('reorder')
  async reorder(
    @Param('sipocId') sipocId: string,
    @Body() reorderDto: ReorderElementsDto,
  ) {
    return this.sipocService.reorderElements(sipocId, reorderDto);
  }

  @Put(':elementId')
  async update(
    @Param('elementId') elementId: string,
    @Body() updateElementDto: UpdateElementDto,
  ) {
    return this.sipocService.updateElement(elementId, updateElementDto);
  }

  @Delete(':elementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('elementId') elementId: string) {
    await this.sipocService.deleteElement(elementId);
  }
}
