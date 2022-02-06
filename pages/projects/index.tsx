import type { NextPage } from "next";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Layout, { LayoutColumn } from "@kiwicom/orbit-components/lib/Layout";
import Box from "@kiwicom/orbit-components/lib/Box";

import ProjectCard from "../../components/ProjectCard";
import { Plus } from "@kiwicom/orbit-components/icons";
import Button from "@kiwicom/orbit-components/lib/Button";
import { useRouter } from "next/router";
import useGetProjectCollection from "../../utils/hooks/useGetProjectCollection";

const Projects: NextPage = () => {
  const { push } = useRouter();
  const { data: projectCollectionSnapshot } = useGetProjectCollection();
  return (
    <Layout type="MMB">
      <LayoutColumn>
        <Box padding={{ top: "large", bottom: "XLarge" }}>
          <Stack direction="row" justify="between">
            <Heading type="display">Projects</Heading>
            <Button
              circled
              iconLeft={<Plus />}
              title="Create new project"
              type="secondary"
              onClick={() => {
                push(`projects/project-edit`);
              }}
            >
              New Project
            </Button>
          </Stack>
        </Box>
        <Stack
          direction="column"
          align="center"
          justify="start"
          spacing="large"
        >
          {projectCollectionSnapshot?.docs.map((projectSnapshot) => (
            <ProjectCard
              key={projectSnapshot.id}
              projectId={projectSnapshot.id}
              project={projectSnapshot.data()}
            />
          ))}
        </Stack>
      </LayoutColumn>
    </Layout>
  );
};

export default Projects;
