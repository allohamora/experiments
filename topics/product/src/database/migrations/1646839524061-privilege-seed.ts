import { Privilege, Role } from 'src/privilege/privilege.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class privilegeSeed1646839524061 implements MigrationInterface {
  private privilegeName = 'privilege_seed';

  public async up({ manager }: QueryRunner): Promise<void> {
    const privilege = manager.create(Privilege, {
      name: this.privilegeName,
      description: 'cool privilege',
      price: '100.00',
      role: Role.Vip,
      period: 10,
    });

    await manager.save(privilege);
  }

  public async down({ manager }: QueryRunner): Promise<void> {
    await manager.delete(Privilege, { name: this.privilegeName });
  }
}
