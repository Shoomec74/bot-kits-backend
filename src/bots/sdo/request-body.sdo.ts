import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

const messengerDescription: IFieldDescription = createNestedObject([
  createField('name', 'VK', 'string', '', true),
  createField('pages', ['vk.com/club1245321223'], 'array'),
  createField('accessKey', '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo'),
  createField('url', 'www.some-url.com'),
]);

const settingsDescription: IFieldDescription = createNestedObject([
  createField(
    'settings',
    {
      Приветствие: 'Я бот-автоответчик',
      Инлайн_кнопка: 'Текст кнопки',
    },
    'object',
  ),
]);

const botsDescription: IFieldDescription[] = [
  createField('isTemplate', 'false', 'boolean', '', true),
  createField(
    'icon',
    'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  ),
  createField('title', 'Создание заказов', 'string', '', true),
  createField('description', 'Бот для создания заказов'),
  createField(
    'features',
    ['Создание заказов', 'Редактирование заказов'],
    'array',
  ),
  { ...messengerDescription, key: 'messenger' },
  { ...settingsDescription, key: 'settings' },
];

export const BotCreateRequestBody = new ApiPropertyFactory(
  botsDescription,
).generate('BotCreateRequestBody');
