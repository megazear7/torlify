import { RequestOptions } from "../shared/main.service.js";
import {
  GenerateBookFieldBodyParameters,
  GenerateBookFieldPathParameters,
  GenerateBookFieldResponse,
  generateBookFieldService,
} from "../shared/service.generate-book-field.js";
import { AbstractController } from "./main.controller.js";
import { getBook } from "./util.book.js";
import { generateBookField } from "./util.generate-book-field.js";

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
    const book = await getBook(pathParams.book);
    const field = await generateBookField(book, pathParams.property, bodyParams.instructions);
    return {
      message: `Generated field ${pathParams.property} successfully for book ${pathParams.book} with instructions: ${bodyParams.instructions}`,
      value: field,
    };
  }
}

export const generateBookFieldController = new GenerateBookFieldController(generateBookFieldService);
