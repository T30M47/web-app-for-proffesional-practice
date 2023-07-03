import { Error } from './Error'
import { ValidationError } from './ValidationError';

export interface ValidationResponse extends Error<ValidationError> {

}
