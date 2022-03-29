import { Role, RoleType } from 'src/users/role.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class rolesSeed1648561516796 implements MigrationInterface {
  private roles = [
    this.createRole({ type: RoleType.Admin }),
    this.createRole({ type: RoleType.Editor }),
    this.createRole({ type: RoleType.User }),
  ];

  private createRole(data: Partial<Role>) {
    return Object.assign(new Role(), data);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(this.roles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const types = this.roles.map(({ type }) => type);

    await queryRunner.manager.delete(Role, { type: In(types) });
  }
}
