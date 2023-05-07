import { ApiMock } from "./types";
import { Schema } from "json-schema-faker";
import generateFakeSchema from "./generateFakeSchema";
import transformToAPIMock from "./transformToAPIMock";
import { OpenAPI } from "openapi-types";

export default function getUpdatedAPIMock(
  apiMock: ApiMock,
  openApiSchema: Schema
): ApiMock {
  const fakerSchema = generateFakeSchema(openApiSchema);
  const newApiMock = transformToAPIMock(
    fakerSchema as OpenAPI.Document,
    apiMock.openAPISchemaUrl
  );

  const newEndpointMockCollection = newApiMock?.endpointMockCollection?.filter(
    (newEndpointMock) =>
      !apiMock.endpointMockCollection.find(
        (currentEndpointMock) =>
          newEndpointMock.endpointPath === currentEndpointMock.endpointPath &&
          newEndpointMock.method === currentEndpointMock.method
      )
  );

  return {
    ...apiMock,
    endpointMockCollection: [
      ...apiMock.endpointMockCollection,
      ...(newEndpointMockCollection || []),
    ],
  };
}
