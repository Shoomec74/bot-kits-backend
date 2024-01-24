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
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import UpdateNotificationDto from 'src/notifications/dto/update-notification.dto';
import { CreatePlatformDto } from 'src/platforms/dto/create-platform.dto';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/profiles/dto/update-profile.dto';
import { Profile } from 'src/profiles/schema/profile.schema';
import { CreateTariffDto } from 'src/tariffs/dto/create-tariff.dto';
import { UpdateTariffDto } from 'src/tariffs/dto/update-tariff.dto';

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
  | typeof UpdatePlatformDto
  | typeof CreatePlatformDto
  | typeof UpdateTariffDto
  | typeof CreateTariffDto
  | typeof UpdateNotificationDto
  | typeof CreateNotificationDto
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
      //--Администраторы могут делать запросы по эндпоинтам связанные с профилем--//
      can(Action.Manage, UpdateProfileDto);
      //--Администраторы НЕ могут удалять чужие профиля и получать к ним доступ--//
      cannot(Action.Manage, CreateProfileDto);

      //--Администраторы могут только получать платформы--//
      can(Action.Read, UpdatePlatformDto);
      //--Администраторы НЕ могут удалять, обновлять и создавать платформы--//
      cannot(Action.Manage, CreatePlatformDto);

      //--Администраторы могут только получать тарифы--//
      can(Action.Create, UpdateTariffDto);
      //--Администраторы НЕ могут удалять, изменять и создавать тарифы--//
      cannot(Action.Manage, CreateTariffDto);

      //--Администраторы могут только создавать уведомления--//
      can(Action.Create, UpdateNotificationDto);
      //--Администраторы НЕ могут удалять, изменять и получать уведомления--//
      cannot(Action.Manage, CreateNotificationDto);

      //--Администраторы могут делать запросы по эндпоинтам связанные с ботами--//
      can(Action.Manage, [CreateBotDto, UpdateBotDto]);
      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );
      //--Администраторы могут обновлять бота если они его создатели и если им был предоставлен общий доступ--//
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
