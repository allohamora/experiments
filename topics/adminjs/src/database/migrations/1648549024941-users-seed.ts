import { Role } from 'src/users/role.enum';
import { User } from 'src/users/user.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class usersSeed1648549024941 implements MigrationInterface {
  private users = [
    this.createUser({ login: 'user', password: 'user', role: Role.User }),
    this.createUser({ login: 'admin', password: 'admin', role: Role.Admin }),
    this.createUser({ login: 'editor', password: 'editor', role: Role.Editor }),
  ];

  private createUser(data: Partial<User>) {
    return Object.assign(new User(), data);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(this.users);

    await queryRunner.manager.save(this.users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const logins = this.users.map(({ login }) => login);

    await queryRunner.manager.delete(User, { login: In(logins) });
  }
}
