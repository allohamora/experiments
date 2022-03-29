import AdminJS, { ResourceWithOptions } from 'adminjs';
import * as TypeORMAdapter from '@adminjs/typeorm';
import { AdminModule as AdminJSModule } from '@adminjs/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Resource } from './resource';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'node:path';
import { Role, RoleType } from 'src/users/role.entity';
import { isAdmin } from './permissions';

AdminJS.registerAdapter(TypeORMAdapter);

const resources: ResourceWithOptions[] = [
  {
    resource: Resource(User),
    options: {
      navigation: null,
      properties: {
        rolesIds: {
          isArray: true,
          reference: 'Role',
          type: 'reference',
          description: 'roles',
        },
      },
      actions: {
        delete: {
          isAccessible: isAdmin,
        },
        bulkDelete: {
          isAccessible: isAdmin,
        },
      },
    },
  },
  {
    resource: Resource(Role),
    options: {
      navigation: null,
      properties: {
        type: {
          isTitle: true,
        },
      },
    },
  },
];

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      imports: [UsersModule, ConfigModule],
      inject: [UsersService, ConfigService],
      useFactory: (
        usersService: UsersService,
        configService: ConfigService,
      ) => ({
        auth: {
          authenticate: async (login, password) => {
            const user = await usersService.getByLogin(login);

            if (!user.roles.some((role) => role.type === RoleType.Editor)) {
              return false;
            }

            return { email: user.login, ...user };
          },
          cookieName: configService.get('ADMIN_COOKIE_NAME'),
          cookiePassword: configService.get('ADMIN_COOKIE_PASSWORD'),
        },
        sessionOptions: {
          resave: false,
          saveUninitialized: false,
          secret: configService.get('ADMIN_COOKIE_PASSWORD'),
        },
        adminJsOptions: {
          branding: {
            companyName: 'AdminJS topic',
          },
          rootPath: '/admin',
          resources,
          dashboard: {
            component: AdminJS.bundle(path.join('components', 'dashboard.jsx')),
          },
          locale: {
            language: 'en',
            translations: {
              properties: {
                email: 'Login',
                rolesIds: 'Roles',
              },
            },
          },
        },
      }),
    }),
  ],
})
export class AdminModule {}
