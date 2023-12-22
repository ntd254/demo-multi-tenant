import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { StorageService } from './storage/storage.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('1')
  get1(): string {
    return this.appService.getHello();
  }

  @Get('2')
  get2(): string {
    return this.appService.getHello();
  }

  @Get('3')
  get3(): string {
    return this.appService.getHello();
  }

  @Get('upload-file')
  uploadFile() {
    return this.storageService.uploadFile();
  }
}
