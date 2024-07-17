import { HttpError } from './HttpError';

export class ResourceNotFoundError extends HttpError {
  constructor() {
    super(404, 'RESOURCE_NOT_FOUND', '요청한 리소스가 존재하지 않습니다.');
  }
}
