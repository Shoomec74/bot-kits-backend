export enum TypeCommands {
  COPY_BOT = 'Копировать бота',
  SHARE_BOT = 'Общий доступ',
  RENAME_BOT = 'Переименовать',
  GET_LINK = 'Получить ссылку',
  GET_INFO = 'Информация',
  NOTIFY_SETTINGS = 'Настройка уведомлений',
  DELETE_BOT = 'Удалить',
}

export const botCommands = [
  TypeCommands.COPY_BOT,
  TypeCommands.DELETE_BOT,
  TypeCommands.RENAME_BOT,
  TypeCommands.SHARE_BOT,
  TypeCommands.GET_LINK,
  TypeCommands.GET_INFO,
  TypeCommands.NOTIFY_SETTINGS,
];
