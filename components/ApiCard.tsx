import Stack from "@kiwicom/orbit-components/lib/Stack";
import Collapse from "@kiwicom/orbit-components/lib/Collapse";
import Text from "@kiwicom/orbit-components/lib/Text";
import Tooltip from "@kiwicom/orbit-components/lib/Tooltip";
import { Clock } from "@kiwicom/orbit-components/icons";
import {
  ApiMock,
  ApiMockTypeEnum,
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
import isAPIMockUpdated from "../utils/isAPIMockUpdated";
import Button from "@kiwicom/orbit-components/lib/Button";
import getUpdatedAPIMock from "../utils/getUpdatedAPIMock";
import { Schema } from "json-schema-faker";

type ApiCardProps = ApiMock &
  (
    | {
        control: Control<ApiMock, unknown>;
        fieldArrayName: "endpointMockCollection";
        allowApiUpdate?: boolean;
      }
    | {
        control:
          | Control<ProjectEditForm, unknown>
          | Control<MockGroupEditForm, unknown>
          | Control<MockEditForm, unknown>;
        fieldArrayName: `apiMockCollection.${number}.endpointMockCollection`;
        allowApiUpdate?: boolean;
      }
  );

const ApiCard = ({
  type,
  title,
  description,
  openAPISchemaUrl,
  endpointMockCollection,
  control,
  fieldArrayName,
  allowApiUpdate,
}: ApiCardProps): JSX.Element => {
  const { fields, append, remove, replace } = useFieldArray({
    control: control as Control<ApiMock, unknown>,
    name: fieldArrayName as "endpointMockCollection",
  });

  const { data: openAPISchema } = useGetOpenAPISchema(
    type === ApiMockTypeEnum.OPENAPI ? openAPISchemaUrl : null
  );

  useEffect(() => {
    remove();
    endpointMockCollection.forEach((endpointMock) => {
      append(endpointMock);
    });
  }, []);

  const hasSchemaViolatingResponse = fields.some(
    (endpoint) => endpoint.validity === EndpointMockValidityEnum.VIOLATES_SCHEMA
  );
  const isOutdated = openAPISchema
    ? isAPIMockUpdated(
        {
          type,
          title,
          description,
          openAPISchemaUrl,
          endpointMockCollection,
        },
        openAPISchema
      )
    : false;

  const updateApiMockCollection = () => {
    const updatedApiMock = getUpdatedAPIMock(
      {
        type,
        title,
        description,
        openAPISchemaUrl,
        endpointMockCollection,
      },
      openAPISchema as Schema
    );
    replace(updatedApiMock.endpointMockCollection);
  };

  return (
    <Collapse
      actions={
        allowApiUpdate &&
        isOutdated && (
          <Button
            onClick={updateApiMockCollection}
            circled
            size="small"
            type="primarySubtle"
          >
            Update
          </Button>
        )
      }
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
          {isOutdated && (
            <Tooltip content="Mocks are outdated. Please update API Mock.">
              <Clock color="warning" />
            </Tooltip>
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
