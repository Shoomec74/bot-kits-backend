import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
} from 'src/utils/apiPropertyFactory';

const profileDescription: IFieldDescription[] = [
  createField('_id', '65196b9715b55bd51b039144', 'string', ' ', true),
  createField('username', 'test', 'string', ' ', true),
  createField('phone', '+79999999999', 'string', ' ', true),
  createField('avatar', 'https://i.pravatar.cc/300', 'string', ' ', true),
  createField('balance', 0, 'number', ' ', true),
  {
    key: 'accounts',
    example: ['65196b9715b55bd51b039144'],
    type: 'array',
  },
  createField('success', true, 'boolean'),
];

export const UserProfileResponseBodyOK = new ApiPropertyFactory(
  profileDescription,
).generate('UserProfileResponseBodyOK');
