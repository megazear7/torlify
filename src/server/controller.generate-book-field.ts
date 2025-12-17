import { RequestOptions } from "../shared/main.service.js";
import {
  GenerateBookFieldBodyParameters,
  GenerateBookFieldPathParameters,
  GenerateBookFieldResponse,
  generateBookFieldService,
} from "../shared/service.generate-book-field.js";
import { wait } from "../shared/util.wait.js";
import { AbstractController } from "./main.controller.js";

export class GenerateBookFieldController extends AbstractController<
  GenerateBookFieldBodyParameters,
  GenerateBookFieldPathParameters,
  GenerateBookFieldResponse
> {
  async handler({
    bodyParams,
    pathParams,
  }: RequestOptions<
    GenerateBookFieldBodyParameters,
    GenerateBookFieldPathParameters
  >): Promise<GenerateBookFieldResponse> {
    // TODO Implement actual generation logic
    await wait(3000);
    return {
      message: `(TODO NOT IMPLEMENTED) Generated field ${pathParams.property} successfully for book ${pathParams.book} with instructions: ${bodyParams.instructions}`,
      value: "Generated value",
    };
  }
}

export const generateBookFieldController = new GenerateBookFieldController(generateBookFieldService);
