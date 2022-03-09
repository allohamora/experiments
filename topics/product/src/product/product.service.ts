import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoinDto } from './dto/create-coin.dto';
import { CreatePrivilegeDto } from './dto/create-privelege.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ProductContentDto } from './dto/product-content.dto';
import { Product, ProductType } from './product.entity';
import { CoinAttributes } from './variant/coin.variant';
import { PrivilegeAttributes } from './variant/privilege.variant';
import { ItemAttributes } from './variant/item.variant';

interface CreateProductDto extends ProductContentDto {
  type: ProductType;
  attributes: unknown;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async getProducts() {
    return await this.productRepository.find();
  }

  private async createAndSaveProduct({
    type,
    name,
    description,
    price,
    attributes,
  }: CreateProductDto) {
    const token = this.productRepository.create({
      type,
      name,
      description,
      price,
      attributes,
    });

    return await this.productRepository.save(token);
  }

  public async createCoin({ id, ...base }: CreateCoinDto) {
    const attributes: CoinAttributes = { id };

    return await this.createAndSaveProduct({
      type: ProductType.Coin,
      attributes,
      ...base,
    });
  }

  public async createItem({ id, ...base }: CreateItemDto) {
    const attributes: ItemAttributes = { id };

    return await this.createAndSaveProduct({
      type: ProductType.Item,
      attributes,
      ...base,
    });
  }

  public async createPrivilege({ role, period, ...base }: CreatePrivilegeDto) {
    const attributes: PrivilegeAttributes = { role, period };

    return await this.createAndSaveProduct({
      type: ProductType.Privilege,
      attributes,
      ...base,
    });
  }
}
