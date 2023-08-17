import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto.';
import { UserEntity } from './entities/user.entity';
import { compare, hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Email alaready exist');
    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.userRepository.create(userSignUpDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists)
      throw new BadRequestException('Email and Password do not match!');

    const matchPassowrd = await compare(
      userSignInDto.password,
      userExists.password,
    );

    if (!matchPassowrd) throw new BadRequestException('Invalid Password');

    delete userExists.password;

    return userExists;
  }

  async generateToken(user: UserEntity): Promise<string> {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      },
    );
  }

  async findAll(): Promise<Array<UserEntity>> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    return user;
  }
}
