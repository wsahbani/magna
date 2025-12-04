import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OpenIDAuthGuard extends AuthGuard('openid') {}
