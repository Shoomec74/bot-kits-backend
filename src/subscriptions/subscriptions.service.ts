import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tariff } from 'src/tariffs/schema/tariff.schema';

import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';
import { Profile } from '../profiles/schema/profile.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Payment } from '../payments/schema/payment.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
  ) {}

  async subscriptionAndPayments(profile: Profile): Promise<object> {
    const subscription = await this.subscriptionModel.findOne({ profile });
    const payment = await this.paymentModel.find({ profile });
    const dataObject = {
      tariff: '',
      status: false,
      cardMask: '',
      debitDate: new Date(),
      balance: profile.balance,
      payments: payment,
    };
    if (subscription) {
      const tariff = await this.tariffModel
        .findById(subscription.tariff)
        .exec();
      dataObject.tariff = tariff.name;
      dataObject.status = subscription.status;
      dataObject.cardMask = subscription.cardMask;
      dataObject.debitDate = subscription.debitDate;
    }
    return dataObject;
  }

  async activateSubscription(profile: Profile, status: boolean) {
    const subscription = await this.subscriptionModel
      .findOne({ profile: profile })
      .exec();
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    subscription.status = status;
    await subscription.save();
    return subscription;
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ profile: createSubscriptionDto.profile })
      .exec();
    const tariff = await this.tariffModel
      .findById(createSubscriptionDto.tariffId)
      .exec();
    if (!tariff) {
      throw new UnprocessableEntityException('Неверный идентификатор тарифа');
    }
    if (subscription) {
      await this.subscriptionModel.findByIdAndRemove(subscription.id).exec();
    }
    return await this.subscriptionModel.create({
      ...createSubscriptionDto,
      tariff,
      status: true,
    });
  }

  async delete(id: number) {
    return await this.subscriptionModel.findByIdAndRemove(id).exec();
  }

  async findOne(id: number): Promise<Subscription> {
    return this.subscriptionModel.findById(id).exec();
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionModel.find().exec();
  }
}
