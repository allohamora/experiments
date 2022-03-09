import { Coin } from 'src/coin/coin.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class coinSeed1646839122820 implements MigrationInterface {
  private coinName = 'coin_seed';

  public async up({ manager }: QueryRunner): Promise<void> {
    const coin = manager.create(Coin, {
      name: this.coinName,
      description: 'cool coin',
      price: '10.00',
      currency: 'CC',
    });

    await manager.save(coin);
  }

  public async down({ manager }: QueryRunner): Promise<void> {
    await manager.delete(Coin, { name: this.coinName });
  }
}
