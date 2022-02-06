import mockOpenApiV3 from "../mockedData/mockOpenApiV3";
import mockOpenApiV2 from "../mockedData/mockOpenApiV2";
import validateResponseObject from "../validateResponseObject";
import { EndpointMockValidityEnum } from "../types";

describe("validateResponseObject", () => {
  const testResponseArray = [
    {
      id: 58000000,
      name: "Lorem ipsum dolor laborum",
      tag: "Lorem ipsum dolor laborum",
    },
    {
      id: 58000000,
      name: "Lorem ipsum dolor laborum",
      tag: "Lorem ipsum dolor laborum",
    },
  ];

  describe.each([
    { type: "v2", schema: mockOpenApiV2 },
    { type: "v3", schema: mockOpenApiV3 },
  ])("OpenAPI $type support", ({ schema }) => {
    it(`returns "${EndpointMockValidityEnum.WITHOUT_SCHEMA}" when response matches schema`, () => {
      const result = validateResponseObject(
        schema,
        testResponseArray,
        "/pets",
        "get",
        200
      );

      expect(result).toStrictEqual(EndpointMockValidityEnum.VALID);
    });

    it(`returns "${EndpointMockValidityEnum.WITHOUT_SCHEMA}" when schema is undefined/null`, () => {
      const result = validateResponseObject(
        undefined,
        testResponseArray,
        "/pets",
        "get",
        200
      );

      expect(result).toStrictEqual(EndpointMockValidityEnum.WITHOUT_SCHEMA);
    });

    it(`returns "${EndpointMockValidityEnum.WITHOUT_SCHEMA}" when definition is missing in the schema`, () => {
      const result = validateResponseObject(
        schema,
        testResponseArray,
        "/pets",
        "get",
        204
      );

      expect(result).toStrictEqual(EndpointMockValidityEnum.WITHOUT_SCHEMA);
    });

    it(`returns "${EndpointMockValidityEnum.VIOLATES_SCHEMA}" "when response violates schema`, () => {
      const result = validateResponseObject(
        schema,
        {
          id: 58000000,
          name: "Lorem ipsum dolor laborum",
          tag: "Lorem ipsum dolor laborum",
        },
        "/pets",
        "get",
        200
      );

      expect(result).toStrictEqual(
        "#/: Expected type array but found type object"
      );
    });
  });
});
