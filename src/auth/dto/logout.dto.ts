import {PartialType} from '@nestjs/mapped-types'
import {ReqUserDto} from "./reqUser.dto";

export class LogoutDto extends PartialType(ReqUserDto) {
}