import { ListResponse } from './list.response';

/**
 * Pagination된 목록을 반환할 때 사용하는 공통 response
 */
export class PaginatedListResponse<T> extends ListResponse<T> {
  /**
   * items: 요청된 컬렉션에서 offset ~ offset + index - 1 까지의 값
   */

  /**
   * Paginiation 되지 않은 컬렉션의 전체 크기.
   */
  totalSize: number;
  /**
   * 요청 시작 인덱스. 이 response 첫번째 아이템의 컬렉션 인덱스
   */
  offset: number;
  /**
   * 요청된 페이지 크기. 컬렉션에 데이터가 충분히 없다면, items의 크기는 limit보다 작을 수 있음.
   */
  limit: number;

  constructor(items: T[], totalSize: number, offset: number, limit: number) {
    super(items);
    this.totalSize = totalSize;
    this.offset = offset;
    this.limit = limit;
  }
}
