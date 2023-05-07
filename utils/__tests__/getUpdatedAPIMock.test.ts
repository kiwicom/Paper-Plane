import getUpdatedAPIMock from "../getUpdatedAPIMock";
import mockOpenApiV2 from "../mockedData/mockOpenApiV2";
import mockOpenApiV3 from "../mockedData/mockOpenApiV3";
import {
  ApiMock,
  ApiMockTypeEnum,
  EndpointMockMethodEnum,
  EndpointMockValidityEnum,
} from "../types";

describe.each([
  { type: "v2", openApiSchema: mockOpenApiV2 },
  { type: "v3", openApiSchema: mockOpenApiV3 },
])("getUpdatedAPIMock", ({ type, openApiSchema }) => {
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

  it(`should return an updated ApiMock with new endpoint mocks (OpenApi ${type})`, () => {
    const updatedApiMock = getUpdatedAPIMock(apiMock, openApiSchema);

    expect(updatedApiMock).toHaveProperty("endpointMockCollection");
    expect(updatedApiMock.endpointMockCollection).toHaveLength(
      4
    );
    expect(updatedApiMock.endpointMockCollection).toContainEqual(
      apiMock.endpointMockCollection[0]
    );
  });

  it(`should not duplicate existing endpoint mocks (OpenApi ${type})`, () => {
    const updatedApiMock = getUpdatedAPIMock(apiMock, openApiSchema);

    const duplicateEndpointMocks = updatedApiMock.endpointMockCollection.filter(
      (endpointMock, index, self) =>
        self.findIndex(
          (otherEndpointMock) =>
            otherEndpointMock.endpointPath === endpointMock.endpointPath &&
            otherEndpointMock.method === endpointMock.method
        ) !== index
    );

    expect(duplicateEndpointMocks).toHaveLength(0);
  });

  it(`should preserve other properties of the ApiMock (OpenApi ${type})`, () => {
    const updatedApiMock = getUpdatedAPIMock(apiMock, openApiSchema);

    expect(updatedApiMock.type).toBe(apiMock.type);
    expect(updatedApiMock.title).toBe(apiMock.title);
    expect(updatedApiMock.description).toBe(apiMock.description);
    expect(updatedApiMock.openAPISchemaUrl).toBe(apiMock.openAPISchemaUrl);
  });
});
