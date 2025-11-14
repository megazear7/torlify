import { AbstractService, NoBodyParams, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import { BookMinimalInfoList } from "./type.book.js";

export class ListBooksService extends AbstractService<
  NoBodyParams,
  NoPathParams,
  BookMinimalInfoList
> {
  readonly type = ServiceType.enum.json;
  readonly method = HttpMethod.enum.get;
  readonly path = "/api/books";
}

export const listBooksService = new ListBooksService(NoBodyParams, NoPathParams, BookMinimalInfoList);
