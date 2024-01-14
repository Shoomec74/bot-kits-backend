import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Role from 'src/accounts/types/role';
import { CreateBotDto } from 'src/bots/dto/create-bot.dto';
import { CreateTemplateDto } from 'src/bots/dto/create-template.dto';
import { UpdateBotDto } from 'src/bots/dto/update-bot.dto';
import { Bot, BotDocument } from 'src/bots/schema/bots.schema';
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/profiles/dto/update-profile.dto';
import { Profile } from 'src/profiles/schema/profile.schema';

//ability.factory.ts
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Share = 'share',
  Copy = 'copy',
  CreateOnlyFromTemplate = 'createOnlyFromTemplate',
}

export type Subjects = InferSubjects<
  | typeof CreateTemplateDto
  | typeof UpdateBotDto
  | typeof CreateBotDto
  | typeof CreateProfileDto
  | typeof UpdateProfileDto
  | typeof CreatePaymentDto
  | 'all'
>;

@Injectable()
export class AbilityFactory {
  constructor(@InjectModel(Bot.name) private botModel: Model<BotDocument>) {}

  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }
  //--Функция defineAbility определяет, что может делать пользователь в приложении--//
  defineAbility(user: Profile): PureAbility {
    type AppAbility = PureAbility<[Action, Subjects | typeof this.botModel]>;
    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);
    //--Создаем строитель AbilityBuilder, который поможет нам определить правила доступа--//
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    //--Здесь определяем правила доступа--//
    if (isAdmin) {
      //--Администраторы могут делать запросы по эндпоинтам связанные с ботами--//
      can(Action.Manage, [CreateBotDto, UpdateBotDto]);
      //--Администраторы могут делать запросы по эндпоинтам связанные с профилем--//
      can(Action.Manage, UpdateProfileDto);
      //--Администраторы могут получать историю платежей и добавлять в неё новые финансовые операции--//
      can([Action.Read, Action.Create], CreatePaymentDto);
      //--Администраторы НЕ могут удалять и изменять историю платежей--//
      cannot([Action.Delete, Action.Update], CreatePaymentDto);
      //--Администраторы НЕ могут удалять чужие профиля и получать к ним доступ--//
      cannot(Action.Manage, CreateProfileDto);
      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );
      //--Администраторы могут обновлять бота если они его создатели и если им ьыл предоставлен общий доступ--//
      can(Action.Update, this.botModel, (bot: Bot) => {
        return (
          bot.profile.equals(user._id) ||
          user.receivedSharedAccess.some((access) => {
            //--Создаем объект с пришедшими правами для сравнения--//
            const comparisonObject = {
              ...bot.permission,
              profile: bot.profile._id,
            };
            //--Сравниваем объект выданных прав с пришедшими в запросе--//
            return Object.keys(comparisonObject).every((key) => {
              return (
                access[key].toString() === comparisonObject[key].toString()
              );
            });
          })
        );
      });
      //--Администраторы могут копировать, удалять бота если они его создатели--//
      can([Action.Copy, Action.Delete], this.botModel, ({ profile }) =>
        profile.equals(user._id),
      );
      //--Администраторы могут создавать бота только из щаблонов--//
      can(
        Action.CreateOnlyFromTemplate,
        this.botModel,
        ({ type }) => type === 'template',
      );
    } else if (isSuperAdmin) {
      //--Супер администраторы имеют доступ ко всем операциям в приложении--//
      can(Action.Manage, 'all');
    } else {
      //--Остальные ничего не могут--//
      cannot(Action.Manage, 'all').because('Зарегистрируйтесь');
    }
    //--Возвращаем сформированный набор правил в гарду--//
    return build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
