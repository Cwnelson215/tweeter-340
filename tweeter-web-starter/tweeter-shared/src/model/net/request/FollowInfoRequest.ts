import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowInfoRequest extends TweeterRequest {
  readonly token: string;
  readonly timestamp: number;
  readonly user: UserDto;
}
