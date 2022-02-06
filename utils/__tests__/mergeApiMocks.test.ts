import {
  ApiMockTypeEnum,
  EndpointMockMethodEnum,
  EndpointMockValidityEnum,
} from "../types";
import mergeApiMocks from "../mergeApiMocks";

describe("mergeApiMocks", () => {
  const projectApiMockCollection = [
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
  const mockGroupApiMockCollection = [
    {
      ...projectApiMockCollection[1],
      endpointMockCollection: [
        {
          endpointPath: "/endpoint",
          responseStatus: 200,
          responseObject: { hello: "world" },
          method: EndpointMockMethodEnum.POST,
          validity: EndpointMockValidityEnum.VALID,
        },
      ],
    },
  ];

  const mockApiMockCollection = [
    {
      ...projectApiMockCollection[0],
      endpointMockCollection: [
        {
          endpointPath: "/endpoint",
          responseStatus: 200,
          responseObject: { baz: 1 },
          method: EndpointMockMethodEnum.GET,
          validity: EndpointMockValidityEnum.VALID,
        },
      ],
    },
  ];

  it("returns merged api mocks", () => {
    expect(
      mergeApiMocks(
        projectApiMockCollection,
        mockGroupApiMockCollection,
        mockApiMockCollection
      )
    ).toStrictEqual([
      {
        ...mockApiMockCollection[0],
        endpointMockCollection: [
          mockApiMockCollection[0].endpointMockCollection[0],
          projectApiMockCollection[0].endpointMockCollection[1],
        ],
      },
      mockGroupApiMockCollection[0],
    ]);
  });

  it("only return project mocks if other mock level are unavailable", () => {
    expect(mergeApiMocks(projectApiMockCollection)).toStrictEqual(
      projectApiMockCollection
    );
    expect(mergeApiMocks(projectApiMockCollection, [], [])).toStrictEqual(
      projectApiMockCollection
    );
  });
});
