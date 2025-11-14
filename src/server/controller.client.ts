import { page } from "./service.client.js";
import { AbstractController } from "./main.controller.js";
import { HttpMethod } from "../shared/type.http.js";

export class ClientController extends AbstractController<
  undefined,
  undefined,
  string
> {
  readonly method = HttpMethod.enum.get;
  readonly path = "/{*any}";

  async handler(): Promise<string> {
    return page();
  }
}
