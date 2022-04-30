import type { NextPage } from "next";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Text from "@kiwicom/orbit-components/lib/Text";
import Box from "@kiwicom/orbit-components/lib/Box";
import { Controller, useForm, useWatch } from "react-hook-form";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import { Separator } from "@kiwicom/orbit-components";
import Button from "@kiwicom/orbit-components/lib/Button";
import Switch from "@kiwicom/orbit-components/lib/Switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { MockEditForm } from "../../../../../../utils/types";
import { mockEditValidationSchema } from "../../../../../../utils/validationSchemas";
import Layout from "../../../../../../components/Layout";
import ApiCard from "../../../../../../components/ApiCard";
import useGetMockDocument from "../../../../../../utils/hooks/useGetMockDocument";
import useGetProjectDocument from "../../../../../../utils/hooks/useGetProjectDocument";
import useGetMockGroupDocument from "../../../../../../utils/hooks/useGetMockGroupDocument";
import useMockMutation from "../../../../../../utils/hooks/useMockMutation";
import mergeApiMocks from "../../../../../../utils/mergeApiMocks";
import filterChangedApiMocks from "../../../../../../utils/filterChangedApiMocks";
import { useEffect } from "react";
import { useAuth } from "../../../../../../components/contexts/Auth";
import Lock from "@kiwicom/orbit-components/lib/icons/Lock";
import LockOpen from "@kiwicom/orbit-components/lib/icons/LockOpen";
import canDeleteMock from "../../../../../../utils/canDeleteMock";
import useMockDeletion from "../../../../../../utils/hooks/useMockDeletion";

const MockEdit: NextPage = () => {
  const auth = useAuth();
  const form = useForm<MockEditForm>({
    mode: "all",
    resolver: zodResolver(mockEditValidationSchema),
    defaultValues: {
      apiMockCollection: [],
      isLocked: false,
    },
  });
  const {
    basePath,
    query: { projectId, mockGroupId, mockId },
  } = useRouter();
  const { handleSubmit, watch, control, reset } = form;

  const mockDocument = useGetMockDocument(
    projectId as string,
    mockGroupId as string,
    mockId as string | undefined
  );
  const mockGroupDocument = useGetMockGroupDocument(
    projectId as string,
    mockGroupId as string
  );
  const projectDocument = useGetProjectDocument(projectId as string);
  const { mutate } = useMockMutation(
    projectId as string,
    mockGroupId as string,
    mockId as string | undefined
  );
  const { mutate: deleteMock } = useMockDeletion(
    projectId as string,
    mockGroupId as string,
    mockId as string | undefined
  );

  const onSubmit = handleSubmit((data) => {
    const project = projectDocument?.data?.data();
    const mockGroup = mockGroupDocument?.data?.data();
    const mock = mockDocument?.data?.data();
    if (project && mockGroup) {
      const mergedApiMocks = mergeApiMocks(
        project.apiMockCollection,
        mockGroup.apiMockCollection,
        mock?.apiMockCollection
      );
      const changedApiMocks = filterChangedApiMocks(
        mergedApiMocks,
        data.apiMockCollection
      );
      mutate({ ...data, apiMockCollection: changedApiMocks });
    }
  });

  useEffect(() => {
    const project = projectDocument?.data?.data();
    const mockGroup = mockGroupDocument?.data?.data();
    const mock = mockDocument?.data?.data();
    if (
      projectId &&
      project &&
      mockGroup &&
      !mockGroupDocument?.isLoading &&
      !projectDocument?.isLoading
    ) {
      reset({
        authorEmail: auth?.email || "",
        mockName: "",
        mockDescription: "",
        clientUrl: mockGroup.clientUrl,
        apiOverrideUrlParamName: mockGroup.apiOverrideUrlParamName,
        ...mock,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - some form typing weirdness
        apiMockCollection: mergeApiMocks(
          project.apiMockCollection,
          mockGroup.apiMockCollection,
          mock?.apiMockCollection
        ),
      });
    }
  }, [
    projectId,
    mockGroupDocument?.isLoading,
    projectDocument?.isLoading,
    mockDocument?.isLoading,
    auth,
  ]);

  const apiMockCollection = useWatch({ name: "apiMockCollection", control });
  const authorEmail = useWatch({ name: "authorEmail", control });
  const isLocked = useWatch({ name: "isLocked", control });

  return (
    <>
      <Layout
        isLoading={
          mockGroupDocument?.isLoading ||
          projectDocument?.isLoading ||
          mockDocument?.isLoading
        }
        sidebar={
          <Stack justify="between" direction="column" align="center">
            <Box padding="XLarge" width="100%">
              <Stack direction="column" spacing="XXLarge">
                <Stack direction="row" align="center" justify="start">
                  <Heading type="display">
                    {watch("mockName") || "My new mock"}
                  </Heading>
                  {isLocked ? (
                    <Lock color="warning" />
                  ) : (
                    <LockOpen color="success" />
                  )}
                </Stack>

                <Heading type="displaySubtitle">
                  {watch("mockDescription") || "description..."}
                </Heading>
              </Stack>
            </Box>
            <Box padding="XLarge" width="100%">
              <Text type="secondary" size="small">
                Author: {authorEmail}
              </Text>
            </Box>
          </Stack>
        }
      >
        <form onSubmit={onSubmit}>
          <Stack spacing="XLarge">
            <Stack>
              <Controller
                name="mockName"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    label="Mock Name"
                    placeholder="My new mock"
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="mockDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    label="Mock Description"
                    placeholder="description..."
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Stack align="center" direction="row">
                <Text weight="bold">Lock for changes</Text>
                <Controller
                  name="isLocked"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={isLocked}
                      icon={isLocked ? <Lock /> : <LockOpen />}
                    />
                  )}
                />
              </Stack>
            </Stack>
            <Separator />
            <Heading type="title2">Client</Heading>
            <Controller
              name="clientUrl"
              control={control}
              render={({ field, fieldState }) => (
                <InputField
                  {...field}
                  label="Client URL"
                  placeholder="https://paper-plane-app.com"
                  suffix={
                    <Box padding={{ right: "large" }}>
                      {`?${
                        watch("apiOverrideUrlParamName") || "custom_api"
                      }=${basePath}`}
                    </Box>
                  }
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="apiOverrideUrlParamName"
              control={control}
              render={({ field, fieldState }) => (
                <InputField
                  {...field}
                  label="URL query parameter for mock API"
                  placeholder="custom_api"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Separator />
            <Stack direction="row" justify="between" align="center">
              <Heading type="title2">Server</Heading>
            </Stack>
            {apiMockCollection.map((apiMock, index) => (
              <ApiCard
                fieldArrayName={`apiMockCollection.${index}.endpointMockCollection`}
                key={index}
                control={control}
                {...apiMock}
              />
            ))}
            <Separator />
            <Stack direction="row-reverse" justify="between">
              <Button size="large" submit>
                Submit
              </Button>
              {mockId && (
                <Button
                  disabled={
                    !canDeleteMock(
                      auth?.email,
                      projectDocument?.data?.data(),
                      mockDocument?.data?.data()
                    )
                  }
                  size="large"
                  type="critical"
                  onClick={() => {
                    deleteMock();
                  }}
                >
                  Delete
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Layout>
    </>
  );
};

export default MockEdit;
