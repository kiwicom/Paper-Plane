/* eslint-disable babel/camelcase */
import JSONSchemaFaker, { Schema } from "json-schema-faker";
import { JSONSchema4 } from "json-schema";
import _ from "lodash";
import { OpenAPI } from "openapi-types";
import { JsonObject } from "type-fest";

const generateFakeSchema = (
  openAPIJsonSchema: Schema
): OpenAPI.Document | null => {
  //  bypassing errors from JSONSchemaFaker parser
  if ((openAPIJsonSchema as JSONSchema4)?.components?.securitySchemes) {
    (openAPIJsonSchema as JSONSchema4).components.securitySchemes = _.mapValues(
      (openAPIJsonSchema as JSONSchema4).components.securitySchemes,
      (securitySchema) => {
        // type is unsupported by JSONSchemaFaker
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, ...restOfSecuritySchema } = securitySchema;
        return restOfSecuritySchema;
      }
    );
  }

  const fakeSchema = JSONSchemaFaker.generate(openAPIJsonSchema);

  if (((fakeSchema as JsonObject)?.info as JsonObject)?.title) {
    return fakeSchema as unknown as OpenAPI.Document;
  }

  return null;
};

export default generateFakeSchema;
