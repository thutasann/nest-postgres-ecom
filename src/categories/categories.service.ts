import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(
    id: number,
    fields: Partial<UpdateCategoryDto>,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('category not found');
    Object.assign(category, fields); // same with repository.create

    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
