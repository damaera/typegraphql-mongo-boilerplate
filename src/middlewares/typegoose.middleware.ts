import { MiddlewareFn } from "type-graphql";
import { Model, Document } from "mongoose";
import { getClassForDocument } from "@typegoose/typegoose";

export let TypegooseMiddleware: MiddlewareFn = async (_, next) => {
  let result = await next();

  if (Array.isArray(result)) {
    return result.map(item =>
      item instanceof Model ? convertDocument(item) : item
    );
  }

  if (result instanceof Model) {
    return convertDocument(result);
  }

  return result;
};

function convertDocument(doc: Document) {
  let convertedDocument = doc.toObject();
  let DocumentClass = getClassForDocument(doc) as NewableFunction;
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
  return convertedDocument;
}
