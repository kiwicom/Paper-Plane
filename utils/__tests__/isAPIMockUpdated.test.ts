import {
  ApiMock,
  EndpointMockMethodEnum,
  ApiMockTypeEnum,
  EndpointMockValidityEnum,
} from "../types";

import isAPIMockUpdated from "../isAPIMockUpdated";
import mockOpenApiV2 from "../mockedData/mockOpenApiV2";
import mockOpenApiV3 from "../mockedData/mockOpenApiV3";
import getUpdatedAPIMock from "../getUpdatedAPIMock";

describe.each([
  { type: "v2", openApiSchema: mockOpenApiV2 },
  { type: "v3", openApiSchema: mockOpenApiV3 },
])("isAPIMockUpdated", ({ type, openApiSchema }) => {
  const apiMock: ApiMock = {
    type: ApiMockTypeEnum.OPENAPI,
    title: "Test API",
    description: "This is a test API",
    openAPISchemaUrl: "https://example.com/schema.json",
    endpointMockCollection: [
      {
        endpointPath: "/test",
        responseStatus: 200,
        responseObject: { message: "Success" },
        method: EndpointMockMethodEnum.GET,
        summary: "Test endpoint",
        description: "This is a test endpoint",
        validity: EndpointMockValidityEnum.VALID,
      },
    ],
  };

  it(`should return true if the ApiMock needs to be updated (OpenApi ${type})`, () => {
    const result = isAPIMockUpdated(apiMock, openApiSchema);

    expect(result).toBe(true);
  });

  it(`should return false if the ApiMock does not need to be updated (OpenApi ${type})`, () => {
    const updatedApiMock = getUpdatedAPIMock(apiMock, openApiSchema);

    const result = isAPIMockUpdated(updatedApiMock, openApiSchema);

    expect(result).toBe(false);
  });
});
