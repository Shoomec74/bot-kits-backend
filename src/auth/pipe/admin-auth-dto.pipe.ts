import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import TypeAccount from '../../accounts/types/type-account';
import Role from '../../accounts/types/role';
import { AuthDto } from '../dto/auth.dto';
import { AdminCombinedDto } from '../dto/admin-combined.dto';

@Injectable()
export class AdminAuthDtoPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: AdminCombinedDto, metadata: ArgumentMetadata): AuthDto {
    const enrichedProfile = {
      phone: value.phone,
      username: value.username,
      balance: 0,
      avatar: 'https://i.pravatar.cc/300',
      accounts: [],
    };

    const enrichedAccount = {
      type: TypeAccount.LOCAL,
      role: Role.USER,
      credentials: {
        email: value.email.toLowerCase(),
        password: value.password,
        accessToken: '',
        refreshToken: '',
      },
      profile: '',
    };

    return {
      profileData: enrichedProfile,
      accountData: enrichedAccount,
    };
  }
}
