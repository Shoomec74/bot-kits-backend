import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Payment, PaymentDocument } from './schema/payment.schema';
import { Profile } from '../profiles/schema/profile.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentModel.create({
      ...createPaymentDto,
    });
  }

  async delete(id: string) {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    return await this.paymentModel.findByIdAndRemove(id).exec();
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.find().exec();
  }

  async findUsersAll(profile: Profile): Promise<Payment[]> {
    return await this.paymentModel.find({ profile }).exec();
  }

  async update(
    id: string,
    updatePaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    //Не проверяем принадлежность операции пользователю, поскольку метод для администрирования, а не фронта
    await this.paymentModel.findByIdAndUpdate(id, updatePaymentDto);
    return this.findOne(id);
  }
}
