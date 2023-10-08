import { botCommands } from './botCommands';

export const botTemplates = [
  {
    type: 'template',
    title: 'Бот автоответчик',
    description:
      'Бот ответит стандартным сообщением на запрос от человека. Подходит для всех мессенджеров. Шаблон' +
      ' возможно изменить под ваши цели.',
    icon: 'none',
    messengers: [],
    profile: null,
    features: [],
    settings: {},
    commands: botCommands,
  },
  {
    type: 'template',
    title: 'Доставка еды',
    description: 'Бот поможет оформить заказ в ресторане',
    icon: 'none',
    messengers: [],
    profile: null,
    features: [],
    settings: {},
    commands: botCommands,
  },
  {
    type: 'template',
    title: 'Демо бот',
    description: 'Бот для показа демо',
    icon: 'none',
    messengers: [],
    profile: null,
    features: [],
    settings: {},
    commands: botCommands,
  },
  {
    type: 'template',
    title: 'Опрос',
    description: 'Бот для проведения опросов',
    icon: 'none',
    messengers: [],
    profile: null,
    features: [],
    settings: {},
    commands: botCommands,
  },
];
