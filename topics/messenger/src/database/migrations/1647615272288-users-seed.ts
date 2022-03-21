import { Search, SearchContentType } from 'src/search/search.entity';
import { Role } from 'src/user/role.enum';
import { User } from 'src/user/user.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class usersSeed1647615272288 implements MigrationInterface {
  private users = [
    this.createUser('andrew', Role.User),
    this.createUser('john', Role.User),
    this.createUser('alfred', Role.User),
  ];

  private createUser(login: string, role: Role) {
    const search = new Search();
    search.name = login;
    search.type = SearchContentType.User;

    const user = new User();

    user.login = login;
    user.role = role;
    user.search = search;

    return user;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(this.users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const logins = this.users.map(({ login }) => login);

    await queryRunner.manager.delete(User, { login: In(logins) });
  }
}
