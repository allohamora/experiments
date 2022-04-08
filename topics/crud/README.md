# crud 08.04.22

create full crud examples with html forms on front and vanilla nodejs on back

## form

- form enctype supports only 'application/x-www-form-urlencoded and 'multipart/form-data'. if you pass unsupported it will be replaced before request to 'application/x-www-form-urlencoded' (http://htmlbook.ru/html/form/enctype)
- form method supports only GET and POST. if you pass unsupported it will be replaced before request to GET (http://htmlbook.ru/html/form/method)
- form can't fill named parameters in action url, you need write script to manually change it
