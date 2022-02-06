import {
  ApiMockTypeEnum,
  EndpointMockMethodEnum,
  EndpointMockValidityEnum,
} from "../types";
import filterChangedApiMocks from "../filterChangedApiMocks";

describe("filterChangedApiMocks", () => {
  const mergedApiMocks = [
    {
      type: ApiMockTypeEnum.OPENAPI,
      title: "My API",
      openAPISchemaUrl: "https://example.api.com/schema.json",
      endpointMockCollection: [
        {
          endpointPath: "/endpoint",
          responseStatus: 200,
          responseObject: { baz: 1, foo: 3 },
          method: EndpointMockMethodEnum.GET,
          validity: EndpointMockValidityEnum.VALID,
        },
        {
          endpointPath: "/endpoint2",
          responseStatus: 201,
          responseObject: ["foo", "baz"],
          method: EndpointMockMethodEnum.GET,
          validity: EndpointMockValidityEnum.VALID,
        },
      ],
    },
    {
      type: ApiMockTypeEnum.OPENAPI,
      title: "My API 2",
      openAPISchemaUrl: "https://example.api-two.com/schema.json",
      endpointMockCollection: [
        {
          endpointPath: "/endpoint",
          responseStatus: 404,
          responseObject: null,
          method: EndpointMockMethodEnum.POST,
          validity: EndpointMockValidityEnum.VALID,
        },
      ],
    },
  ];

  it("returns only changed APIs and changed endpoints", () => {
    const alteredEndpointMock = {
      endpointPath: "/endpoint",
      responseStatus: 201,
      responseObject: { baz: 2 },
      method: EndpointMockMethodEnum.GET,
      validity: EndpointMockValidityEnum.VALID,
    };
    const alteredApiMocks = [
      {
        ...mergedApiMocks[0],
        endpointMockCollection: [
          alteredEndpointMock,
          mergedApiMocks[0].endpointMockCollection[1],
        ],
      },
      mergedApiMocks[1],
    ];
    expect(
      filterChangedApiMocks(mergedApiMocks, alteredApiMocks)
    ).toStrictEqual([
      {
        type: ApiMockTypeEnum.OPENAPI,
        title: "My API",
        openAPISchemaUrl: "https://example.api.com/schema.json",
        endpointMockCollection: [alteredEndpointMock],
      },
    ]);
  });
  it("ignores changes of endpoint validity", () => {
    const alteredEndpointMock = {
      endpointPath: "/endpoint",
      responseStatus: 200,
      responseObject: { baz: 1, foo: 3 },
      method: EndpointMockMethodEnum.GET,
      validity: EndpointMockValidityEnum.WITHOUT_SCHEMA,
    };
    const alteredApiMocks = [
      {
        ...mergedApiMocks[0],
        endpointMockCollection: [
          alteredEndpointMock,
          mergedApiMocks[0].endpointMockCollection[1],
        ],
      },
      mergedApiMocks[1],
    ];
    expect(
      filterChangedApiMocks(mergedApiMocks, alteredApiMocks)
    ).toStrictEqual([]);
  });
});
