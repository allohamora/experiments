import { IsEnum, IsInt, Min } from 'class-validator';
import { ProductContentDto } from 'src/product/dto/product-content.dto';
import { Role } from '../privilege.entity';

export class CreatePrivilegeDto extends ProductContentDto {
  @IsEnum(Role)
  role: Role;

  @IsInt()
  @Min(1)
  period: number;
}
