import type { NextPage } from "next";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Button from "@kiwicom/orbit-components/lib/Button";
import { Plus } from "@kiwicom/orbit-components/lib/icons";
import Box from "@kiwicom/orbit-components/lib/Box";
import MockGroupCard from "../../../components/MockGroupCard";
import InputGroup from "@kiwicom/orbit-components/lib/InputGroup";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import Select from "@kiwicom/orbit-components/lib/Select";
import { ChangeEvent, useEffect, useState } from "react";
import Illustration from "@kiwicom/orbit-components/lib/Illustration";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import useGetProjectDocument from "../../../utils/hooks/useGetProjectDocument";
import useGetMockGroupCollection from "../../../utils/hooks/useGetMockGroupCollection";

const defaultWebUrlBases = ["http://localhost:3000", "http://localhost:8000"];

const Mocks: NextPage = () => {
  const {
    push,
    query: { projectId },
  } = useRouter();
  const projectDocument = useGetProjectDocument(projectId as string);
  const projectData = projectDocument?.data?.data();
  const {
    data: mockGroupCollectionSnapshot,
    isLoading: isLoadingMockGroupCollection,
  } = useGetMockGroupCollection(projectId as string);
  const [webUrlBase, setWebUrlBase] = useState(defaultWebUrlBases[0]);
  const [webUrlBaseOptions, setWebUrlBaseOptions] = useState([
    ...defaultWebUrlBases.map((url) => ({
      value: url,
      label: url,
    })),
  ]);

  useEffect(() => {
    if (projectData) {
      const projectUrlBase = new URL(projectData.clientUrl).origin;
      setWebUrlBaseOptions(
        webUrlBaseOptions.concat({
          value: projectUrlBase,
          label: projectUrlBase,
        })
      );
      setWebUrlBase(projectUrlBase);
    }
  }, [projectDocument?.isLoading]);

  return (
    <Layout
      isLoading={projectDocument?.isLoading || isLoadingMockGroupCollection}
      sidebar={
        <Stack justify="start" direction="column" align="center">
          <Box padding="XLarge">
            <Stack direction="column" spacing="large">
              <Heading type="display">{projectData?.projectName}</Heading>
              <Heading type="displaySubtitle">
                {projectData?.projectDescription}
              </Heading>
              <Stack align="center" justify="center">
                <Illustration name="Lounge" />
              </Stack>
            </Stack>
          </Box>
          <Stack>
            <Box padding="large">
              <InputGroup
                flex={["9 9 15em", "0.5 0.5 0.5em"]}
                label="Web URL base"
              >
                <InputField
                  onChange={(event) =>
                    setWebUrlBase(
                      (event as ChangeEvent<HTMLInputElement>).target.value
                    )
                  }
                  value={webUrlBase}
                  inputMode="url"
                />
                <Select
                  value={webUrlBase}
                  onChange={(event) => {
                    setWebUrlBase(
                      (event as ChangeEvent<HTMLSelectElement>).target.value
                    );
                  }}
                  options={webUrlBaseOptions}
                />
              </InputGroup>
            </Box>
          </Stack>
        </Stack>
      }
    >
      <Stack direction="column">
        <Stack direction="row-reverse">
          <Button
            circled
            size="large"
            iconLeft={<Plus />}
            title="Create new Mock"
            type="secondary"
            onClick={() => {
              push(`${projectId}/mock-group-edit`);
            }}
          >
            New Mock Group
          </Button>
        </Stack>
        {mockGroupCollectionSnapshot?.docs.map((mockGroup) => (
          <MockGroupCard
            webUrlBase={webUrlBase}
            mockGroup={mockGroup.data()}
            mockGroupId={mockGroup.id}
            key={mockGroup.id}
          />
        ))}
      </Stack>
    </Layout>
  );
};

export default Mocks;
