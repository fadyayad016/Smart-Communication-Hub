import { IsInt } from 'class-validator';

export class GetConversationDto{
    @IsInt()
  targetUserId: number;
}