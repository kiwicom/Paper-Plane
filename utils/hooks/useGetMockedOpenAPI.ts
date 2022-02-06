import { ApiMock } from "../types";
import generateFakeSchema from "../generateFakeSchema";
import { useQuery, UseQueryResult } from "react-query";
import useGetOpenAPISchema from "./useGetOpenAPISchema";
import { Schema } from "json-schema-faker";
import transformToAPIMock from "../transformToAPIMock";
import { OpenAPI } from "openapi-types";

const useGetMockedOpenAPI = (
  openAPISchemaUrl: string
): UseQueryResult<ApiMock | null | undefined, Error> => {
  const { data: schema } = useGetOpenAPISchema(openAPISchemaUrl);
  return useQuery(
    ["useGetMockedOpenAPI", openAPISchemaUrl],
    () => {
      const fakeSchema = generateFakeSchema(schema as Schema);
      return transformToAPIMock(
        fakeSchema as OpenAPI.Document,
        openAPISchemaUrl
      );
    },
    { enabled: Boolean(schema), retry: 0 }
  );
};

export default useGetMockedOpenAPI;
