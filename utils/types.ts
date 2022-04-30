import { Props as IllustrationProps } from "@kiwicom/orbit-components/lib/Illustration";
import { CollectionReference } from "@firebase/firestore";

export enum EndpointMockValidityEnum {
  VALID = "valid",
  VIOLATES_SCHEMA = "violates OpenAPI schema",
  WITHOUT_SCHEMA = "could not found definition in schema",
}

export enum EndpointMockMethodEnum {
  GET = "get",
  POST = "post",
  PUT = "put",
  HEAD = "head",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  CONNECT = "connect",
  TRACE = "trace",
}

export type EndpointMock = {
  endpointPath: string;
  responseStatus: number;
  responseObject: unknown;
  method: EndpointMockMethodEnum;
  summary?: string;
  description?: string;
  validity: EndpointMockValidityEnum | string;
};

export enum ApiMockTypeEnum {
  OPENAPI = "OpenAPI",
  CUSTOM = "Custom",
}

export enum CollaboratorRoleEnum {
  ADMIN = "Admin",
  EDITOR = "Editor",
}

type Collaborators = Record<
  string,
  {
    email: string;
    role: CollaboratorRoleEnum;
  }
>;

export type ApiMock = {
  type: ApiMockTypeEnum;
  title: string;
  description?: string;
  openAPISchemaUrl: string;
  endpointMockCollection: Array<EndpointMock>;
};

export type JSONInputContentType = {
  plainText: string;
  markupText: string;
  json: string;
  jsObject: unknown;
  lines: number;
  error:
    | false
    | {
        reason: string | undefined;
        line: number | undefined;
        theme: string | undefined;
      };
};
export type MockEditForm = {
  mockName: string;
  mockDescription: string;
  clientUrl: string;
  apiOverrideUrlParamName: string;
  apiMockCollection: Array<ApiMock>;
  authorEmail: string;
  isLocked: boolean;
};

export type MockGroupEditForm = {
  mockGroupName: string;
  mockGroupDescription: string;
  clientUrl: string;
  apiOverrideUrlParamName: string;
  apiMockCollection: Array<ApiMock>;
  authorEmail: string;
};

export type ProjectEditForm = {
  projectName: string;
  projectDescription: string;
  illustration: IllustrationProps["name"];
  collaborators: Collaborators;
  clientUrl: string;
  apiOverrideUrlParamName: string;
  apiMockCollection: Array<ApiMock>;
};

export type Mock = MockEditForm;

export type MockGroup = MockGroupEditForm & {
  mockCollection?: CollectionReference<MockEditForm>;
};

export type Project = ProjectEditForm & {
  mockGroupCollection?: CollectionReference<MockGroupEditForm>;
};
