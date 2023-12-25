import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as Minio from 'minio';
import * as path from 'path';

@Injectable({ scope: Scope.REQUEST })
export class StorageService {
  private readonly minioClient: Minio.Client;
  private readonly tenantId: string;

  constructor(@Inject(REQUEST) request: Request, configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: configService.get('MINIO_ENDPOINT'),
      port: Number(configService.get('MINIO_PORT')),
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
      useSSL: configService.get('MINIO_USE_SSL') === 'true',
    });
    this.tenantId = request.headers['x-tenant-id'] as string;
  }

  async uploadFile(bucketName: string) {
    if (!this.tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }

    return await this.minioClient.fPutObject(
      `${this.tenantId}-${bucketName}`,
      'README.md',
      path.join(__dirname, '../../README.md'),
      {
        'Content-Type': 'text/markdown',
      },
    );
  }

  async createBucket(name: string) {
    if (!this.tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }

    return await this.minioClient.makeBucket(`${this.tenantId}-${name}`);
  }
}
