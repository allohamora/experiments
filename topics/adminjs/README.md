# adminjs (admin-bro) / 29.03.2022

- Doesn't have support for not BaseEntity Entities in TypeORM. But can be used that monkey patch:

```js
Reflect.setPrototypeOf(User, BaseEntity);
```

- Have "quill" moderate vulnerability. No fix available
- Normal way to store sessions is not exists due of this you need re-login after each app reload. But maybe (not tested) can be used express-session store option
- Normal way to customize /login page is not exists. But can be used monkey patch with injected .js and .css assets to all pages with customization login page, and when page is loaded check: page === /login => inject code, else => return.
- ManyToMany relations unsupported. But can be used that monkey patch:

```js
{
  resource: User,
  options: {
    properties: {
      rolesIds: {
        isArray: true,
        reference: 'Role',
        type: 'reference',
      },
    },
}
```
