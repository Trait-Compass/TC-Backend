export class FailResponse {
  constructor(
      readonly path: string,
      readonly errorCode: string,
      readonly errorMessage: string,
      readonly traceId: string,
  ) {}
  readonly status: string = 'false'
}
