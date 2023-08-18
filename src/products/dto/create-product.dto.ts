import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title cannot be blank' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description cannot be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'price should not be empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be number & max decimal precission 2' },
  )
  @IsPositive({ message: 'price should be positive number' })
  price: number;

  @IsNotEmpty({ message: 'stock should not be empty.' })
  @IsNumber(
    {},
    { message: 'stock should be number & max decimal precission 2' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  stock: number;

  @IsNotEmpty({ message: 'images should not be empty' })
  @IsArray({ message: 'Images should be in array format.' })
  images: string[];

  @IsNotEmpty({ message: 'category should not be empty' })
  @IsNumber({}, { message: 'category id should be number' })
  categoryId: number;
}
