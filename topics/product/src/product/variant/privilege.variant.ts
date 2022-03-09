import { isFactory, Product, ProductType } from '../product.entity';

export interface PrivilegeAttributes {
  role: string;
  period: number;
}

export interface Privilege extends Product {
  type: ProductType.Privilege;
  attributes: PrivilegeAttributes;
}

export const isPrivilege = isFactory<Privilege>(ProductType.Privilege);
