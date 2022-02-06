import Button from "@kiwicom/orbit-components/lib/Button";
import Modal, {
  ModalHeader,
  ModalFooter,
  ModalSection,
} from "@kiwicom/orbit-components/lib/Modal";
import useGetMockedOpenAPI from "../utils/hooks/useGetMockedOpenAPI";
import { ApiMock, ApiMockTypeEnum } from "../utils/types";
import { Controller, UnpackNestedValue, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import Portal from "@kiwicom/orbit-components/lib/Portal";
import { Separator } from "@kiwicom/orbit-components";
import ApiCard from "./ApiCard";
import { useEffect } from "react";
import Alert from "@kiwicom/orbit-components/lib/Alert";
import { apiMockEditValidationSchema } from "../utils/validationSchemas";

type ApiMockEditForm = ApiMock;

type AddNewAPIModalProps = {
  onClose: () => void;
  onSubmit: (data: UnpackNestedValue<ApiMockEditForm>) => void;
};

const AddNewAPIModal = ({
  onClose,
  onSubmit,
}: AddNewAPIModalProps): JSX.Element => {
  const form = useForm<ApiMockEditForm>({
    mode: "all",
    resolver: zodResolver(apiMockEditValidationSchema),
  });
  const { handleSubmit, control, watch, setValue, register, getFieldState } =
    form;
  const isValidOpenAPISchemaUrl =
    getFieldState("openAPISchemaUrl").isDirty &&
    !getFieldState("openAPISchemaUrl").invalid;
  const {
    data: apiMock,
    isLoading,
    error,
  } = useGetMockedOpenAPI(watch("openAPISchemaUrl"));

  useEffect(() => {
    register("title");
    register("description");
    register("type");
    // eslint-disable-next-line no-warning-comments
    // TODO: add support for custom API mocks
    setValue("type", ApiMockTypeEnum.OPENAPI);
    if (apiMock && !error) {
      setValue("title", apiMock.title);
      setValue("description", apiMock.description);
      return;
    }
    setValue("title", "");
    setValue("description", "");
  }, [apiMock, error, setValue, register]);

  // eslint-disable-next-line no-console
  const onSubmitForm = handleSubmit((data) => onSubmit(data));

  return (
    <Portal>
      <form onSubmit={onSubmitForm}>
        <Modal onClose={onClose}>
          <ModalHeader title="Add new API" />
          <ModalSection>
            <Stack>
              <Controller
                name="openAPISchemaUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    label="OpenAPI JSON Schema URL"
                    placeholder="https://my.awesome.api.io/v1/openapi.json"
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Separator />
              {error && isValidOpenAPISchemaUrl && (
                <Alert
                  icon
                  type="warning"
                  title="Failed to load the OpenAPI schema"
                >
                  {error.message}
                </Alert>
              )}
              {apiMock && !error && !isLoading && (
                <ApiCard
                  control={control}
                  {...apiMock}
                  fieldArrayName="endpointMockCollection"
                />
              )}
            </Stack>
          </ModalSection>
          <ModalFooter>
            <Button loading={isLoading} submit>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </form>
    </Portal>
  );
};

export default AddNewAPIModal;
