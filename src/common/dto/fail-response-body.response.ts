export class FailResponse {
  constructor(
    readonly errorCode: string,
    readonly errorMessage: string,
    readonly traceId: string,
  ) {}
}
