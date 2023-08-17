import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto.';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: UserEntity }> {
    return {
      user: await this.usersService.signup(userSignUpDto),
    };
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{
    accessToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.generateToken(user);

    return {
      accessToken,
      user,
    };
  }

  @Get('all')
  async findAll(): Promise<Array<UserEntity>> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }
}
