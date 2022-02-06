import { EndpointMockValidityEnum } from "./types";
import ZSchema from "z-schema";

const validateResponseObject = (
  openAPISchema: unknown,
  responseObject: unknown,
  path: string,
  method: string,
  statusCode: number
): EndpointMockValidityEnum | string => {
  if (!openAPISchema) {
    return EndpointMockValidityEnum.WITHOUT_SCHEMA;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const schemaPath = openAPISchema?.openapi
    ? `paths.["${path}"].${method}.responses.["${statusCode}"].content.["application/json"].schema`
    : `paths.["${path}"].${method}.responses.["${statusCode}"].schema`;
  const validator = new ZSchema({ ignoreUnknownFormats: true });
  try {
    const isValid = validator.validate(responseObject, openAPISchema, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - z-schema is missing one function overload type which supports options object with schemaPath
      schemaPath,
    });

    return isValid
      ? EndpointMockValidityEnum.VALID
      : `${validator.getLastError().details[0].path}: ${
          validator.getLastError().details[0].message
        }`;
  } catch (e) {
    return EndpointMockValidityEnum.WITHOUT_SCHEMA;
  }
};

export default validateResponseObject;
