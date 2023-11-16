import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './schema/profile.schema';
import { Account } from 'src/accounts/schema/account.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
// import TypeAccount from 'src/accounts/types/type-account';
// import { AuthDto } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { FindProfileDto } from './dto/find-profile.dto';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(
    createProfileDto: CreateProfileDto,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    const profileNew = new this.profileModel(createProfileDto);
    if (session) {
      return await profileNew.save({ session: session });
    }
    return await profileNew.save();
  }

  async findOne(id: string | number): Promise<Profile> {
    return await this.profileModel.findById(id).exec();
  }

  async findAccountsByProfileId(id: string): Promise<Account[]> {
    const profile = await this.findById(id);
    return profile.accounts;
  }

  async findAccountByToken(token: string) {
    return await this.accountModel
      .findOne({
        'credentials.accessToken': token,
      })
      .populate('profile');
  }

  async findAccountByEmail(
    email: string,
    session?: mongoose.ClientSession,
  ): Promise<Account | null> {
    return await this.accountModel
      .findOne({ 'credentials.email': email }, { 'credentials.password': 0 })
      .session(session)
      .populate('profile');
  }

  async findById(id: string): Promise<Profile> {
    const foundProfile = await this.profileModel.findById(id);

    if (!foundProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    const profile = await foundProfile.populate('accounts');
    profile.accounts.forEach((account) => {
      if (account.credentials) {
        delete account.credentials.password;
      }
    });

    return profile;
  }

  async findAll(): Promise<Profile[]> {
    return await this.profileModel.find().exec();
  }

  async findByPartnerRef(ref: string): Promise<Profile | null> {
    return await this.profileModel.findOne({ partner_ref: ref });
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    session?: ClientSession,
  ): Promise<Profile> {
    return await this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, {
        new: true,
      })
      .session(session);
  }

  async remove(id: string): Promise<Profile> {
    return await this.profileModel.findByIdAndDelete(id).exec();
  }

  // async addUser(
  //   authDto: AuthDto,
  //   provider: TypeAccount = TypeAccount.LOCAL,
  //   ref: string | null,
  // ): Promise<Account> {
  //   return await this.authService.registration(authDto, provider, ref);
  // }

  async addUser(findProfileDto: FindProfileDto): Promise<Profile> {
    // const account = await this.accountModel.findOne({
    //   'credentials.email': email,
    // });
    // if (!account) {
    //   throw new NotFoundException('Пользователь с указанным Email не найден');
    //   console.log(666);
    // }
    // return account;
    const { email, username, phone } = findProfileDto;
    if (email) {
      const account = await this.findAccountByEmail(email);
      return account.profile;
    } else {
      if (username !== '') {
        return await this.profileModel.findOne({ username: username });
      } else {
        return await this.profileModel.findOne({ phone: phone });
      }
    }
  }
}
