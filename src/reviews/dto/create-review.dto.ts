import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product Id should not be empty' })
  @IsNumber({}, { message: 'Product ID should be number' })
  productId: number;

  @IsNotEmpty({ message: 'Rating could not be empty' })
  @IsNumber()
  @IsNumber()
  ratings: number;

  @IsNotEmpty({ message: 'Comment should not be empty' })
  comment: string;
}
