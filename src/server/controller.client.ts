import { NoBodyParams, NoPathParams } from "../shared/main.service.js";
import { clientService } from "../shared/service.client.js";
import { AbstractController } from "./main.controller.js";

export class ClientController extends AbstractController<
  NoBodyParams,
  NoPathParams,
  string
> {
  async handler(): Promise<string> {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Book Maker New</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="/app.css" />
          <script type="module" src="/bundle.js"></script>
        </head>
        <body>
          <torlify-app></torlify-app>
        </body>
      </html>
    `;
  }
}

export const clientController = new ClientController(clientService);
