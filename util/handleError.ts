import { ApolloError } from 'apollo-server-errors';

class InternalServerError extends ApolloError {
  constructor(message: string) {
    super(message, 'InternalServerError');

    Object.defineProperty(this, 'name', { value: 'InternalServerError' });
  }
};
//TODO: ApolloServer has InternalServerError but need someway to set headers to change http status code
//      as for now not used


export const handleError = {
    InternalServerError
};