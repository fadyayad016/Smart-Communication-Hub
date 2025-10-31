import { IsInt } from 'class-validator';

export class GenerateInsightDto {
  @IsInt()
  targetUserId: number;
}