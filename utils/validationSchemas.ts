import { z } from "zod";
import {
  ApiMockTypeEnum,
  CollaboratorRoleEnum,
  EndpointMockMethodEnum,
  EndpointMockValidityEnum,
} from "./types";

export const apiMockEditValidationSchema = z.object({
  type: z.nativeEnum(ApiMockTypeEnum),
  title: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  openAPISchemaUrl: z.string().url().min(1, { message: "Required" }),
  endpointMockCollection: z.array(
    z.object({
      endpointPath: z.string().regex(/^\/.*/),
      responseStatus: z.number().min(100).max(599),
      responseObject: z.nullable(z.unknown()),
      method: z.nativeEnum(EndpointMockMethodEnum),
      summary: z.string().optional(),
      description: z.string().optional(),
      validity: z.enum([
        EndpointMockValidityEnum.VALID,
        EndpointMockValidityEnum.WITHOUT_SCHEMA,
      ]),
    })
  ),
});

export const projectEditValidationSchema = z.object({
  projectName: z.string().min(1, { message: "Required" }),
  projectDescription: z.string().min(1, { message: "Required" }),
  illustration: z.string().min(1, { message: "Required" }),
  clientUrl: z.string().url(),
  apiOverrideUrlParamName: z.string().min(1, { message: "Required" }),
  apiMockCollection: z.array(apiMockEditValidationSchema),
  collaborators: z.record(
    z.object({
      email: z.string().email(),
      role: z.nativeEnum(CollaboratorRoleEnum),
    })
  ),
});

export const mockGroupEditValidationSchema = z.object({
  mockGroupName: z.string().min(1, { message: "Required" }),
  mockGroupDescription: z.string().min(1, { message: "Required" }),
  clientUrl: z.string().url(),
  apiOverrideUrlParamName: z.string().min(1, { message: "Required" }),
  apiMockCollection: z.array(apiMockEditValidationSchema),
  authorEmail: z.string().email(),
});

export const mockEditValidationSchema = z.object({
  mockName: z.string().min(1, { message: "Required" }),
  mockDescription: z.string().min(1, { message: "Required" }),
  clientUrl: z.string().url(),
  apiOverrideUrlParamName: z.string().min(1, { message: "Required" }),
  apiMockCollection: z.array(apiMockEditValidationSchema),
  authorEmail: z.string().email(),
  isLocked: z.boolean(),
});
