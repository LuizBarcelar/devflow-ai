
import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity.js';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', {
        email: email.trim().toLowerCase(),
      })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    const email = data.email.trim().toLowerCase();

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const user = this.usersRepository.create({
      name: data.name.trim(),
      email,
      passwordHash: data.passwordHash,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      // Protege também contra cadastros simultâneos.
      if (
        error instanceof Error &&
        error.message.includes('UNIQUE constraint failed')
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }

      throw error;
    }
  }
}
