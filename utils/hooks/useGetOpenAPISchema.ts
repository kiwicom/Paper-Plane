import { QueryKey, useQuery, UseQueryResult } from "react-query";
import { Schema } from "json-schema-faker";
import axios from "axios";
import ZSchema from "z-schema";

const useGetOpenAPISchema = (
  openAPIUrl: QueryKey | null
): UseQueryResult<Schema | null, Error> =>
  useQuery(
    ["useGetOpenAPISchema", openAPIUrl],
    async () => {
      if (!openAPIUrl) return null;
      const { data: schema } = await axios(openAPIUrl.toString());

      ZSchema.registerFormat("int64", (val: unknown) => Number.isInteger(val));
      ZSchema.registerFormat("int32", (val: unknown) => Number.isInteger(val));
      const validator = new ZSchema({});

      if (!validator.validateSchema(schema)) {
        throw new Error("Invalid schema!");
      }

      return schema;
    },
    { enabled: Boolean(openAPIUrl) }
  );

export default useGetOpenAPISchema;
