import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { decode } from 'jsonwebtoken';

import {
  BlacklistTokens,
  BlacklistTokensDocument,
} from './schema/blacklistTokens.schema';

@Injectable()
export class BlacklistTokensService {
  constructor(
    @InjectModel(BlacklistTokens.name)
    private readonly blacklistTokensModel: Model<BlacklistTokensDocument>,
  ) {}

  //--Удаляем истекшие токены из БД--//
  private async cleanupTokens(): Promise<void> {
    const now = new Date();
    await this.blacklistTokensModel.deleteMany({
      expirationDate: { $lt: now },
    });
  }

  async addToken(token: string): Promise<void> {
    //--Декодируем токен без проверки подлинности--//
    const decodedToken: any = decode(token);

    //--Проверяем, существует ли поле exp в декодированном токене--//
    if (!decodedToken || !decodedToken.exp) {
      throw new BadRequestException('Невалидный токен');
    }

    //--Преобразуем временную метку UNIX в объект Date--//
    const expirationDate = new Date(decodedToken.exp * 1000);

    const blacklistedToken = new this.blacklistTokensModel({
      token,
      expirationDate,
    });
    await blacklistedToken.save();
    await this.cleanupTokens();
  }
  //--Проверяем есть находитсся ли токен в черном списке--//
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const count = await this.blacklistTokensModel.countDocuments({ token });
    return count > 0;
  }
}
