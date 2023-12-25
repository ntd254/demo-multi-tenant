import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { id: string } }>();

    if (request.method !== 'GET') {
      return undefined;
    }

    if (!request.headers['x-tenant-id']) {
      throw new BadRequestException('Tenant ID is required');
    }

    return request.headers['x-tenant-id'] + request.user?.id
      ? `_user_${request.user.id}`
      : '' + request.url;
  }
}
