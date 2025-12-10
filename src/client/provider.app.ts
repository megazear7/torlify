import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { AppContext, appContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { getAppConfigService } from "../shared/service.get-app-config.js";
import { TorlifyAbstractProvider } from "./provider.abstract.js";

export abstract class TorlifyAppProvider extends TorlifyAbstractProvider {
  @provide({ context: appContext })
  @property({ attribute: false })
  appContext: AppContext = {
    status: LoadingStatus.enum.idle,
  };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.load();
  }

  async load(): Promise<void> {
    this.appContext = {
      app: await getAppConfigService.fetch(),
      status: LoadingStatus.enum.success,
    };
  }
}
