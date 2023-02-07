import { Injectable } from '@nestjs/common';
import { AuthenticationRequest } from './dto/authentication-request/authentication-request';
import { User } from './model/user/user';

@Injectable()
export class AuthenticationService {
  users: User[] = [
    new User('yves.roudier@unice.fr', 'yves', 'roudier', true),
    new User('gt', 'thibault', 'garrot', false),
    new User('dr80', 'robin', 'dijoux', false),
  ];

  authentications: AuthenticationRequest[] = [];

  login(authenticationRequest: AuthenticationRequest) {
    let user = this.users.find(
      (user) => user.id === authenticationRequest.userId.toLowerCase(),
    );

    if (user) {
      this.authentications.push(authenticationRequest);
    }

    return user;
  }
}
