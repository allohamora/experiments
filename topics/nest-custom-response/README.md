# nest-custom-response

- To map all responses to custom you can use [Interceptor](./src/shared/interceptors/custom-response.interceptor.ts)
- To map all responses to custom in swagger you can use [Custom Swagger Decorators](./src/shared/swagger/response-decorators.ts), or edit swagger building (both these methods are monkey patching, but another way is not found)
