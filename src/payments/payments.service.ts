import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import TypeOperation from './types/type-operation';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    private readonly profileService: ProfilesService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const data = await this.paymentModel.create({
      ...createPaymentDto,
    });
    await this.updateBalance(data.profile.id);
    return data;
  }

  async delete(id: string) {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    const profile = (await this.paymentModel.findById(id).exec()).profile;
    await this.paymentModel.findByIdAndDelete(id).exec();
    await this.updateBalance(profile.toString());
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.find().exec();
  }

  async findUsersAll(profile: Profile): Promise<Payment[]> {
    await this.updateBalance(profile.id);
    return await this.paymentModel.find({ profile }).exec();
  }

  async update(
    id: string,
    updatePaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    await this.paymentModel.findByIdAndUpdate(id, updatePaymentDto);
    await this.updateBalance(updatePaymentDto.profile.id);
    return this.findOne(id);
  }

  async updateBalance(profileId: string) {
    const paymentAggregate = await this.paymentModel
      .aggregate([
        {
          $match: { $expr: { $eq: ['$profile', { $toObjectId: profileId }] } },
        },
        { $group: { _id: '$operation', total: { $sum: '$amount' } } },
      ])
      .exec();
    let sum = 0;
    for (const paymentOperation of paymentAggregate) {
      if (paymentOperation._id == TypeOperation.INCOME) {
        sum += paymentOperation.total;
      } else {
        sum -= paymentOperation.total;
      }
    }

    await this.profileService.update(profileId, { balance: sum });
  }
}
