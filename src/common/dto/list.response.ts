/**
 * 목록을 반환할 때 사용하는 공통 response
 */
export class ListResponse<T> {
  items: T[];

  constructor(items: T[]) {
    this.items = items;
  }
}
