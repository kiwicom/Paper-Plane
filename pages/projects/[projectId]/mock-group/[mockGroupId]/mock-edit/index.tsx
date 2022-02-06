import type { NextPage } from "next";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Box from "@kiwicom/orbit-components/lib/Box";
import { Controller, useForm, useWatch } from "react-hook-form";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import { Separator } from "@kiwicom/orbit-components";
import Button from "@kiwicom/orbit-components/lib/Button";
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

const MockEdit: NextPage = () => {
  const form = useForm<MockEditForm>({
    mode: "all",
    resolver: zodResolver(mockEditValidationSchema),
    defaultValues: {
      apiMockCollection: [],
    },
  });
  const {
    basePath,
    query: { projectId, mockGroupId, mockId },
    push,
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
      push(`/projects/${projectId}`);
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
  ]);

  const apiMockCollection = useWatch({ name: "apiMockCollection", control });

  return (
    <>
      <Layout
        isLoading={
          mockGroupDocument?.isLoading ||
          projectDocument?.isLoading ||
          mockDocument?.isLoading
        }
        sidebar={
          <Stack justify="start" direction="column" align="center">
            <Box padding="XLarge" width="100%">
              <Stack direction="column" spacing="XXLarge">
                <Heading type="display">
                  {watch("mockName") || "My new mock"}
                </Heading>
                <Heading type="displaySubtitle">
                  {watch("mockDescription") || "description..."}
                </Heading>
              </Stack>
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
            <Stack direction="row-reverse">
              <Button size="large" submit>
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </Layout>
    </>
  );
};

export default MockEdit;
