import type { NextPage } from "next";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Layout from "../../../components/Layout";
import Box from "@kiwicom/orbit-components/lib/Box";
import { Controller, useForm, useWatch } from "react-hook-form";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import { ListChoice, Separator } from "@kiwicom/orbit-components";
import Button from "@kiwicom/orbit-components/lib/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@kiwicom/orbit-components/lib/Select";
import Illustration from "@kiwicom/orbit-components/lib/Illustration";
import illustrations from "../../../utils/illustations";
import { Edit, Visibility } from "@kiwicom/orbit-components/icons";

import { useEffect, useState } from "react";
import AddNewAPIModal from "../../../components/AddNewAPIModal";
import { Plus } from "@kiwicom/orbit-components/lib/icons";
import { CollaboratorRoleEnum, ProjectEditForm } from "../../../utils/types";
import { projectEditValidationSchema } from "../../../utils/validationSchemas";
import ApiCard from "../../../components/ApiCard";
import { useRouter } from "next/router";
import useProjectMutation from "../../../utils/hooks/useProjectMutation";
import useGetProjectDocument from "../../../utils/hooks/useGetProjectDocument";
import { useAuth } from "../../../components/contexts/Auth";
import Tooltip from "@kiwicom/orbit-components/lib/Tooltip";

const ProjectEdit: NextPage = () => {
  const auth = useAuth();
  const [isAddNewAPIModalVisible, setIsAddNewAPIModalVisible] =
    useState<boolean>(false);
  const {
    basePath,
    query: { projectId },
  } = useRouter();
  const form = useForm<ProjectEditForm>({
    mode: "all",
    resolver: zodResolver(projectEditValidationSchema),
    defaultValues: {
      apiMockCollection: [],
      collaborators: {},
    },
  });

  const { handleSubmit, watch, control, setValue, reset } = form;

  const projectDocument = useGetProjectDocument(
    projectId as string | undefined
  );
  const { mutate } = useProjectMutation(projectId as string | undefined);

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const apiMockCollection = useWatch({ name: "apiMockCollection", control });
  const collaborators = useWatch({ name: "collaborators", control });

  useEffect(() => {
    if (Object.keys(collaborators).length === 0 && auth) {
      setValue("collaborators", {
        [auth.email as string]: {
          email: auth.email as string,
          role: CollaboratorRoleEnum.ADMIN,
        },
      });
    }
    if (projectId && !projectDocument?.isLoading) {
      const project = projectDocument?.data?.data();
      reset(project);
    }
  }, [projectId, projectDocument?.isLoading, auth]);

  return (
    <>
      {isAddNewAPIModalVisible && (
        <AddNewAPIModal
          onSubmit={(data) => {
            setValue("apiMockCollection", apiMockCollection.concat(data));
            setIsAddNewAPIModalVisible(false);
          }}
          onClose={() => setIsAddNewAPIModalVisible(false)}
        />
      )}
      <Layout
        isLoading={projectDocument?.isLoading}
        sidebar={
          <Stack justify="start" direction="column" align="center">
            <Box padding="XLarge" width="100%">
              <Stack direction="column" spacing="XXLarge">
                <Heading type="display">
                  {watch("projectName") || "New Project"}
                </Heading>
                <Heading type="displaySubtitle">
                  {watch("projectDescription") || "Project description..."}
                </Heading>
                {watch("illustration") && (
                  <Stack align="center" justify="center">
                    <Illustration size="large" name={watch("illustration")} />
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        }
      >
        <form onSubmit={onSubmit}>
          <Stack spacing="XLarge">
            <Stack>
              <Controller
                name="projectName"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    label="Project Name"
                    placeholder="New Project"
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="projectDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    label="Project Description"
                    placeholder="Project description..."
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="illustration"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    label="Illustration"
                    placeholder="None"
                    options={illustrations.map((illustration) => ({
                      label: illustration,
                      value: illustration,
                    }))}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
            <Separator />
            <Heading type="title2">Collaborators</Heading>
            {Object.values(collaborators).map((collaborator) => (
              <ListChoice
                icon={
                  <Tooltip content={collaborator.role}>
                    {collaborator.role === CollaboratorRoleEnum.ADMIN ? (
                      <Visibility />
                    ) : (
                      <Edit />
                    )}
                  </Tooltip>
                }
                key={collaborator.email}
                title={collaborator.email}
              />
            ))}
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
              <Button
                circled
                type="secondary"
                iconLeft={<Plus />}
                onClick={() => setIsAddNewAPIModalVisible(true)}
              >
                Add API
              </Button>
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

export default ProjectEdit;
