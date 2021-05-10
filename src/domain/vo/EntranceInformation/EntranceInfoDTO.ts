import { PipeTransform } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class EntranceInfoDTO implements PipeTransform {
  @IsString()
  @IsNotEmpty()
  public account!: string;

  @IsString()
  @IsNotEmpty()
  public password!: string;

  public transform(value: any, metadata: ArgumentMetadata): any {
    return undefined;
  }
}
