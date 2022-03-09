import { isFactory, Product, ProductType } from 'src/product/product.entity';
import { ChildEntity, Column } from 'typeorm';

export enum Role {
  Vip = 'Vip',
}

@ChildEntity(ProductType.Privilege)
export class Privilege extends Product {
  @Column({ enum: Role })
  role: Role;

  @Column()
  period: number;
}

export const isPrivilege = isFactory<Privilege>(ProductType.Privilege);
