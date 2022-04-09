# crud 09.04.22

create full restfull crud examples with html forms on front and vanilla nodejs on back

- to get many use GET:/entities/ with filter in query params
- to get one use GET:/entities/:id
- to create one use POST:/entities with body
- to update (replace) one use PUT:/entities/:id with body
- to parial update one use PATCH:/entities/:id with partial body or [json patch](http://jsonpatch.com)
- to delete one use DELETE:/entities/:id
- to get nested entity you can use:
  - GET:/nested-entities/?main-entity-id=:main-entity-id # not nested approach
  - GET:/main-entities/:main-entity-id/nested-entities/:nested-entity-id # nested approach
- to crud nested entity i prefer use not nested approach where you crud nested-id/nested-ids entity field, but in some cases nested approach with crud entity directly can be useful
- if entity is singular you can use /entity path instead of /entities

## form

- form enctype supports only 'application/x-www-form-urlencoded and 'multipart/form-data'. if you pass unsupported it will be replaced before request to 'application/x-www-form-urlencoded' (http://htmlbook.ru/html/form/enctype)
- form method supports only GET and POST. if you pass unsupported it will be replaced before request to GET (http://htmlbook.ru/html/form/method)
- form can't fill named parameters in action url, you need write script to manually change it
