import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard)
  @Post('create')
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get('all-reviews')
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get('all-reviews-by-product')
  async findAllByProduct(
    @Body('productId') productId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(+productId);
  }

  @Get('single-review/:id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity> {
    return await this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reviewsService.remove(+id);
  }
}
