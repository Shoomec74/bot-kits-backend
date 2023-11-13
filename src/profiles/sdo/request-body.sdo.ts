import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
} from 'src/utils/apiPropertyFactory';

const addUserFields: IFieldDescription[] = [
  createField('password', '123', 'string', 'Пароль пользователя', true),
  createField('email', 'test@mail.ru', 'string', 'Email пользователя', true),
  createField(
    'phone',
    '+79999999999',
    'string',
    'Телефонный номер пользователя',
    true,
  ),
  createField('username', 'test', 'string', 'Имя пользователя', true),
];

export const AddUserRequestBody = new ApiPropertyFactory(
  addUserFields,
).generate('AddUserRequestBody');
