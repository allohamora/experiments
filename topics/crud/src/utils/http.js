export const ContentType = {
  Text: 'text/plain',
  Html: 'text/html',
  Js: 'text/javascript',
  Json: 'application/json',
  FormUrlencoded: 'application/x-www-form-urlencoded',
};

export const Message = {
  Ok: 'Ok',
  Created: 'Created',
  NotFound: 'Not Found',
  BadRequest: 'Bad Request',
  InternalServerError: 'Internal Server Error',
};

export const StatusCode = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
};

export class HttpError extends Error {
  constructor({ message = Message.InternalServerError, statusCode = StatusCode.InternalServerError }) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
  }

  toResponse() {
    const { message: data, statusCode } = this;

    return {
      data,
      statusCode,
    };
  }
}
