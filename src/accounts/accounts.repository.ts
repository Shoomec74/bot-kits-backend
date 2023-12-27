import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, UpdateQuery } from 'mongoose';
import { ITokens } from 'src/auth/auth.service';
import { HashService } from 'src/hash/hash.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountDocument } from './schema/account.schema';
import TypeAccount from './types/type-account';
import { USER_ALREADY_EXISTS_MESSAGE } from 'src/utils/constants';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private readonly hashServise: HashService,
  ) {}

  async create(
    account: CreateAccountDto,
    profile: Types.ObjectId,
    session?: mongoose.ClientSession,
  ): Promise<Account> {
    const hashedPassword = await this.hashServise.getHash(
      account.credentials.password,
    );
    account.credentials.password = hashedPassword;
    account.profile = profile._id;
    try {
      const accountNew = new this.accountModel(account);
      if (session) {
        return await accountNew.save({ session: session });
      }
      return await accountNew.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(USER_ALREADY_EXISTS_MESSAGE);
      }
    }
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel
      .find({}, { 'credentials.password': 0 })
      .exec();
  }

  async findOne(id: string): Promise<Account> {
    return await this.accountModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    session?: mongoose.ClientSession,
  ): Promise<Account> {
    return await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, {
        new: true,
        fields: { 'credentials.password': 0 },
      })
      .session(session);
    //.populate('profile');
  }

  async findByEmail(
    email: string,
    session?: mongoose.ClientSession,
  ): Promise<Account | null> {
    return await this.accountModel
      .findOne({ 'credentials.email': email }, { 'credentials.password': 0 })
      .session(session)
      .populate('profile');
  }

  async findByEmailAndType(
    email: string,
    typeAccount: TypeAccount,
    session?: mongoose.ClientSession,
  ): Promise<Account | null> {
    return await this.accountModel
      .findOne({
        'credentials.email': email,
        type: typeAccount,
      })
      .session(session)
      .populate('profile');
  }

  async findByIdAndProvider(
    id: Types.ObjectId,
    provider: TypeAccount,
  ): Promise<Account> {
    const account: Account = await this.accountModel
      .findOne({
        profile: id,
        type: provider,
      })
      .populate('profile');
    delete account.credentials.password;
    account.profile.accounts = undefined;
    return account;
  }

  async findAndDeleteRefreshToken(refreshToken: string) {
    const account = await this.accountModel.findOne({
      'credentials.refreshToken': refreshToken,
    });
    if (account) {
      account.credentials.refreshToken = undefined;
      await account.save();
      return account;
    } else {
      return null;
    }
  }

  async remove(id: string): Promise<Account> {
    return await this.accountModel.findByIdAndDelete(id).exec();
  }

  async saveRefreshToken(profileId: Types.ObjectId, tokens: ITokens) {
    const updateQuery: UpdateQuery<any> = {
      $set: {
        'credentials.accessToken': tokens.accessToken,
        'credentials.refreshToken': tokens.refreshToken,
      },
    };

    const updatedAccount = await this.accountModel
      .findOneAndUpdate(
        { profile: profileId },
        updateQuery,
        { new: true }, //--Этот параметр возвращает измененный документ--//
      )
      .populate('profile'); //--Возвращает вместе с документом Profile--//

    if (updatedAccount) {
      return updatedAccount.profile;
    } else {
      throw new UnauthorizedException('Невалидный refreshToken');
    }
  }
}
