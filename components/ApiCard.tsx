import Stack from "@kiwicom/orbit-components/lib/Stack";
import Collapse from "@kiwicom/orbit-components/lib/Collapse";
import Text from "@kiwicom/orbit-components/lib/Text";
import Tooltip from "@kiwicom/orbit-components/lib/Tooltip";
import {
  ApiMock,
  EndpointMockValidityEnum,
  MockEditForm,
  MockGroupEditForm,
  ProjectEditForm,
} from "../utils/types";

import { Control, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import useGetOpenAPISchema from "../utils/hooks/useGetOpenAPISchema";
import EndpointCard from "./EndpointCard";
import EndpointMockValidityIcon from "./EndpointMockValidityIcon";

type ApiCardProps = ApiMock &
  (
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

const ApiCard = ({
  title,
  description,
  openAPISchemaUrl,
  endpointMockCollection,
  control,
  fieldArrayName,
}: ApiCardProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    control: control as Control<ApiMock, unknown>,
    name: fieldArrayName as "endpointMockCollection",
  });
  const { data: openAPISchema } = useGetOpenAPISchema(openAPISchemaUrl);

  useEffect(() => {
    remove();
    endpointMockCollection.forEach((endpointMock) => {
      append(endpointMock);
    });
  }, []);

  const hasSchemaViolatingResponse = fields.some(
    (endpoint) => endpoint.validity === EndpointMockValidityEnum.VIOLATES_SCHEMA
  );

  return (
    <Collapse
      label={
        <Stack direction="row" align="center">
          <Tooltip size="medium" content={openAPISchemaUrl}>
            <Text type="primary" weight="bold">
              {title}
            </Text>
          </Tooltip>
          <Text type="secondary">{description}</Text>
          {hasSchemaViolatingResponse && (
            <EndpointMockValidityIcon
              validity={EndpointMockValidityEnum.VIOLATES_SCHEMA}
            />
          )}
        </Stack>
      }
    >
      {fields.map((field, index) => (
        <EndpointCard
          key={field.id}
          control={control as Control<ApiMock, unknown>}
          field={field}
          index={index}
          openAPISchema={openAPISchema}
          fieldArrayName={fieldArrayName as "endpointMockCollection"}
        />
      ))}
    </Collapse>
  );
};

export default ApiCard;
