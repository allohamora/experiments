import { MigrationInterface, QueryRunner, In } from 'typeorm';
import { Product, ProductType } from 'src/product/product.entity';
import { CoinAttributes } from 'src/product/variant/coin.variant';
import { ItemAttributes } from 'src/product/variant/item.variant';
import { PrivilegeAttributes } from 'src/product/variant/privilege.variant';

export class productSeed1646827733925 implements MigrationInterface {
  private coinName = 'coin_seed';
  private itemName = 'item_seed';
  private privilegeName = 'privilege_seed';

  private createCoin() {
    const coin = new Product<CoinAttributes>();
    coin.name = this.coinName;
    coin.description = 'cool coin';
    coin.price = '10.00';
    coin.type = ProductType.Coin;
    coin.attributes = {
      id: 'cool_coin',
    };

    return coin;
  }

  private createItem() {
    const item = new Product<ItemAttributes>();
    item.name = this.itemName;
    item.description = 'cool item';
    item.price = '40.00';
    item.type = ProductType.Item;
    item.attributes = {
      id: 1,
    };

    return item;
  }

  private createPrivilege() {
    const privilege = new Product<PrivilegeAttributes>();
    privilege.name = this.privilegeName;
    privilege.description = 'cool privilege';
    privilege.price = '100.00';
    privilege.type = ProductType.Privilege;
    privilege.attributes = {
      role: 'vip',
      period: 10,
    };

    return privilege;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const coin = this.createCoin();
    const item = this.createItem();
    const privilege = this.createPrivilege();

    await queryRunner.manager.save([coin, item, privilege]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Product, {
      name: In([this.coinName, this.itemName, this.privilegeName]),
    });
  }
}
