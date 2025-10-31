import { IsInt, IsString, MinLength } from "class-validator";

export class CreateMessageDto{
    @IsInt()
  receiverId: number;

  @IsString()
  @MinLength(1)
  text: string;
}