import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { UpdatePromocodeDto } from './dto/update-promocode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Promocode } from './schema/promocode.schema';
import { Model } from 'mongoose';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectModel(Promocode.name) private promocodes: Model<Promocode>,
  ) {}

  async create(createPromocodeDto: CreatePromocodeDto) {
    try {
      const promocode = await this.promocodes.create({
        ...createPromocodeDto,
      });
      return await promocode.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Такой промокод уже существует');
      }
      throw error;
    }
  }

  async findAll(): Promise<Promocode[]> {
    try {
      const promocodes = await this.promocodes.find();
      if (promocodes.length === 0) {
        throw new NotFoundException('Нет ни одного промокода');
      }
      return promocodes;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Promocode> {
    try {
      return await this.promocodes.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Промокода с таким id нет');
    }
  }

  async update(id: string, updatePromocodeDto: UpdatePromocodeDto) {
    try {
      return await this.promocodes.findByIdAndUpdate(
        id,
        {
          ...updatePromocodeDto,
        },
        { new: true },
      );
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  }

  async findOneByCode(code: string): Promise<Promocode> {
    try {
      const promocode = await this.promocodes.findOne({ code: code }).exec();
      if (!promocode) {
        throw new NotFoundException('Промокода с таким названием нет');
      }
      return promocode;
    } catch (error) {
      throw error;
    }
  }

  async updateByCode(code: string) {
    try {
      const promocodeToCheck = await this.findOneByCode(code);
      const curDate = new Date();
      if (!promocodeToCheck) {
        throw new NotFoundException('Промокод не найден');
      }

      if (
        promocodeToCheck.activationCount >= promocodeToCheck.maxActivationCount
      ) {
        throw new HttpException(
          'Количество активаций исчерпано',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (promocodeToCheck.actionPeriod < curDate) {
        throw new HttpException(
          'Промокод не действителен',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.promocodes.findOneAndUpdate(
        { code: code },
        {
          $inc: { activationCount: 1 },
        },
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const promocode = await this.promocodes.findByIdAndDelete(id).exec();
      //сразу после удаления промокод будет равен null
      if (!promocode) {
        throw new NotFoundException('Промокода с таким id нет');
      }

      return promocode;
    } catch (error) {
      throw error;
    }
  }
}
