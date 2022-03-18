import { Role } from 'src/user/role.enum';
import { User } from 'src/user/user.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class usersSeed1647615272288 implements MigrationInterface {
  private users = [
    this.createUser('admin', Role.Admin),
    this.createUser('john', Role.User),
  ];

  private createUser(login: string, role: Role) {
    const admin = new User();

    admin.login = login;
    admin.role = role;

    return admin;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(this.users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const logins = this.users.map(({ login }) => login);

    await queryRunner.manager.delete(User, { login: In(logins) });
  }
}
