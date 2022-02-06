import Stack from "@kiwicom/orbit-components/lib/Stack";
import { CardSection } from "@kiwicom/orbit-components/lib/Card";
import Text from "@kiwicom/orbit-components/lib/Text";
import JSONInput from "react-json-editor-ajrm";
import {
  ApiMock,
  JSONInputContentType,
  MockEditForm,
  MockGroupEditForm,
  ProjectEditForm,
} from "../utils/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - https://github.com/AndrewRedican/react-json-editor-ajrm/issues/163
import locale from "react-json-editor-ajrm/locale/en";
import {
  Control,
  Controller,
  FieldArrayWithId,
  useController,
  useWatch,
} from "react-hook-form";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import validateResponseObject from "../utils/validateResponseObject";
import EndpointMockValidityIcon from "./EndpointMockValidityIcon";
import { Schema } from "json-schema-faker";
import { useEffect, useState } from "react";

type EndpointCardProps = {
  field: FieldArrayWithId<ApiMock, "endpointMockCollection">;
  index: number;
  openAPISchema: Schema | null | undefined;
} & (
  | {
      control: Control<ApiMock, unknown>;
      fieldArrayName: "endpointMockCollection";
    }
  | {
      control:
        | Control<ProjectEditForm, unknown>
        | Control<MockGroupEditForm, unknown>
        | Control<MockEditForm, unknown>;
      fieldArrayName: `apiMockCollection.${number}.endpointMockCollection`;
    }
);

const EndpointCard = ({
  field,
  openAPISchema,
  index,
  control,
  fieldArrayName,
}: EndpointCardProps): JSX.Element => {
  const [JSONInputError, setJSONInputError] =
    useState<JSONInputContentType["error"]>(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [responseObject, endpointPath, method, responseStatus] = useWatch({
    control: control as Control<ApiMock, unknown>,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name: [
      `${fieldArrayName}.${index}.responseObject`,
      `${fieldArrayName}.${index}.endpointPath`,
      `${fieldArrayName}.${index}.method`,
      `${fieldArrayName}.${index}.responseStatus`,
    ],
  });

  const {
    field: { onChange: setValidity },
  } = useController({
    name: `${fieldArrayName}.${index}.validity` as unknown as "endpointMockCollection",
    control: control as Control<ApiMock, unknown>,
  });

  const validity = useWatch({
    control: control as Control<ApiMock, unknown>,
    name: `${fieldArrayName}.${index}.validity` as unknown as "endpointMockCollection",
  });

  useEffect(() => {
    setValidity(
      validateResponseObject(
        openAPISchema,
        responseObject,
        endpointPath,
        method,
        responseStatus
      )
    );
  }, [
    setValidity,
    openAPISchema,
    responseObject,
    endpointPath,
    method,
    responseStatus,
  ]);

  return (
    <CardSection
      expandable
      title={
        <Stack direction="row">
          <EndpointMockValidityIcon validity={validity as unknown as string} />
          <Text weight="bold">{field.method.toUpperCase()}</Text>
          <Text>{field.endpointPath}</Text>
        </Stack>
      }
      description={field.description}
    >
      <Stack>
        <Controller
          name={
            `${fieldArrayName}.${index}.responseStatus` as `endpointMockCollection.${number}.responseStatus`
          }
          control={control as Control<ApiMock, unknown>}
          defaultValue={field.responseStatus}
          render={({ field: renderField, fieldState }) => (
            <InputField
              {...renderField}
              onChange={(e) => {
                renderField.onChange(
                  parseInt((e.target as HTMLTextAreaElement).value, 10)
                );
              }}
              type="number"
              inputMode="numeric"
              label="Response Status Code"
              placeholder={field.responseStatus?.toString() || "200"}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={
            `${fieldArrayName}.${index}.responseObject` as `endpointMockCollection.${number}.responseObject`
          }
          control={control as Control<ApiMock, unknown>}
          rules={{ validate: () => !JSONInputError }}
          defaultValue={field.responseObject}
          render={({ field: renderField }) => (
            <JSONInput
              {...renderField}
              onChange={({ error, jsObject }: JSONInputContentType) => {
                setJSONInputError(error);
                renderField.onChange(jsObject);
              }}
              placeholder={renderField.value}
              locale={locale}
              height="550px"
              width="100%"
            />
          )}
        />
      </Stack>
    </CardSection>
  );
};

export default EndpointCard;
