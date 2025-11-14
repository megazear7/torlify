import { AbstractService, NoBodyParams, NoPathParams, ServiceType } from "./main.service.js";
import { HttpMethod } from "./type.http.js";
import z from "zod";

export class ClientService extends AbstractService<
  NoBodyParams,
  NoPathParams,
  string
> {
  readonly type = ServiceType.enum.html;
  readonly method = HttpMethod.enum.get;
  readonly path = "/{*any}";
}

export const clientService = new ClientService(NoBodyParams, NoPathParams, z.string());
