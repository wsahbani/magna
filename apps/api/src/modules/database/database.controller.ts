import { Controller, Post, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from './database.service';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check if database is empty' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Database status retrieved',
  })
  async checkStatus() {
    const isEmpty = await this.databaseService.isDatabaseEmpty();
    return {
      isEmpty,
      message: isEmpty
        ? 'Database is empty and ready to be seeded'
        : 'Database contains data',
    };
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Seed database with initial data',
    description:
      'Seeds the database with initial data only if the database is empty. This prevents accidental data loss.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Database seeded successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Database is not empty, seeding skipped',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error seeding database',
  })
  async seedDatabase() {
    try {
      const result = await this.databaseService.seedDatabase();

      if (!result.success) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          ...result,
        };
      }

      return {
        statusCode: HttpStatus.OK,
        ...result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Error seeding database',
        error: error.message,
      };
    }
  }
}
