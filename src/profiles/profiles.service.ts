import { Injectable } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './schema/profile.schema';
import { Account } from 'src/accounts/schema/account.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesRepository } from './profiles.repository';
// import { FindProfileDto } from './dto/find-profile.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import TypeAccount from 'src/accounts/types/type-account';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async create(
    createProfileDto: CreateProfileDto,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    return await this.profilesRepository.create(createProfileDto, session);
  }

  async findOne(id: string | number): Promise<Profile> {
    return await this.profilesRepository.findOne(id);
  }

  async findById(id: string): Promise<Profile> {
    return await this.profilesRepository.findById(id);
  }

  async findAccountsByProfileId(id: string): Promise<Account[]> {
    return await this.profilesRepository.findAccountsByProfileId(id);
  }

  async findByEmail(
    email: string,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    const account = await this.profilesRepository.findAccountByEmail(
      email,
      session,
    );
    if (account) {
      return account.profile;
    }
    return null;
  }

  async findByToken(token: string): Promise<Profile | null> {
    const account = await this.profilesRepository.findAccountByToken(token);
    if (account) {
      return account.profile;
    }
    return null;
  }

  async findAll(): Promise<Profile[]> {
    return await this.profilesRepository.findAll();
  }

  async findPartnerRef(ref: string): Promise<Profile | null> {
    return await this.profilesRepository.findByPartnerRef(ref);
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    session?: ClientSession,
  ): Promise<Profile> {
    return await this.profilesRepository.update(id, updateProfileDto, session);
  }

  async remove(id: string): Promise<Profile> {
    return await this.profilesRepository.remove(id);
  }

  async addUser(
    authDto: AuthDto,
    provider: TypeAccount = TypeAccount.LOCAL,
    ref: string | null,
  ) {
    const profile = await this.profilesRepository.addUser(
      authDto,
      provider,
      ref,
    );
    if (profile) {
      return {
        message:
          'Пользователь успешно зарегистрирован и ему выслан пароль на email',
      };
    }
  }

  // Дополнительная реализация добавления пользователя админом.
  // Необходимо оставить 1 вариант после уточнения постановки задачи с заказчиком
  // async addUser(findProfileDto: FindProfileDto) {
  //   const profile = await this.profilesRepository.addUser(findProfileDto);
  //   if (profile) {
  //     return { message: 'Пользователь успешно добавлен' };
  //   }
  //   throw new NotFoundException('Пользователь с указанными данными не найден');
  // }
}
