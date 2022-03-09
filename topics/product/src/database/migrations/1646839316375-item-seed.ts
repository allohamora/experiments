import { Item } from 'src/item/item.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class itemSeed1646839316375 implements MigrationInterface {
  private itemName = 'item_seed';

  public async up({ manager }: QueryRunner): Promise<void> {
    const item = manager.create(Item, {
      name: this.itemName,
      description: 'cool item',
      price: '50.00',
      inGameId: 1,
    });

    await manager.save(item);
  }

  public async down({ manager }: QueryRunner): Promise<void> {
    await manager.delete(Item, { name: this.itemName });
  }
}
