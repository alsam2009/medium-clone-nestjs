import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserResponseInterface } from 'src/types/user.Response';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUsers(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    const userByUserName = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail || userByUserName) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect: boolean = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Password is not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;

    return user;
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user?.id,
        username: user?.username,
        email: user?.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
