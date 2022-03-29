import { Role, RoleType } from 'src/users/role.entity';
import { User } from 'src/users/user.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class usersSeed1648561649103 implements MigrationInterface {
  private async getRoles(queryRunner: QueryRunner) {
    const roles = await queryRunner.manager.find(Role);

    return roles.reduce(
      (map, role) => map.set(role.type, role),
      new Map<RoleType, Role>(),
    );
  }

  private async getUsers(queryRunner: QueryRunner) {
    const roles = await this.getRoles(queryRunner);
    const user = roles.get(RoleType.User);
    const admin = roles.get(RoleType.Admin);
    const editor = roles.get(RoleType.Editor);

    return Promise.all([
      this.createUser({ login: 'user', password: 'user', roles: [user] }),
      this.createUser({
        login: 'editor',
        password: 'editor',
        roles: [user, editor],
      }),
      this.createUser({
        login: 'admin',
        password: 'admin',
        roles: [user, editor, admin],
      }),
    ]);
  }

  private async createUser(data: Partial<User>) {
    return Object.assign(new User(), data);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await this.getUsers(queryRunner);

    await queryRunner.manager.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const users = await this.getUsers(queryRunner);
    const logins = users.map(({ login }) => login);

    await queryRunner.manager.delete(User, { login: In(logins) });
  }
}
