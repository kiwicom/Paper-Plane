import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Button from "@kiwicom/orbit-components/lib/Button";
import { CardSection } from "@kiwicom/orbit-components/lib/Card";
import TileGroup from "@kiwicom/orbit-components/lib/TileGroup";
import Tile from "@kiwicom/orbit-components/lib/Tile";
import { Edit, Plus } from "@kiwicom/orbit-components/lib/icons";
import { ReactElement, useState } from "react";
import MockTile from "./MockTile";
import { useRouter } from "next/router";
import { MockGroup } from "../utils/types";
import useGetMockCollection from "../utils/hooks/useGetMockCollection";

type MockGroupProps = {
  mockGroup: MockGroup;
  mockGroupId: string;
  webUrlBase: string;
};

const MockGroupCard = ({
  mockGroup,
  mockGroupId,
  webUrlBase,
}: MockGroupProps): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    asPath,
    query: { projectId },
  } = useRouter();
  const { data: mockCollectionSnapshot } = useGetMockCollection(
    projectId as string,
    mockGroupId
  );

  return (
    <CardSection
      expandable
      onClick={() => setIsExpanded(!isExpanded)}
      expanded={isExpanded}
      title={
        <Stack inline align="center">
          <Heading type="title2">{mockGroup.mockGroupName}</Heading>
          <Button
            href={`${asPath}/mock-group/${mockGroupId}`}
            size="small"
            type="white"
            iconLeft={<Edit />}
          />
        </Stack>
      }
      description={mockGroup.mockGroupDescription}
    >
      <TileGroup>
        {mockCollectionSnapshot?.docs.map((mock) => (
          <MockTile
            webUrlBase={webUrlBase}
            mockId={mock.id}
            mock={mock.data()}
            mockGroupId={mockGroupId}
            key={mock.id}
          />
        ))}
        <Tile noPadding>
          <Stack justify="center">
            <Button
              href={`${asPath}/mock-group/${mockGroupId}/mock-edit/`}
              fullWidth
              type="white"
              iconLeft={<Plus />}
            >
              New Mock
            </Button>
          </Stack>
        </Tile>
      </TileGroup>
    </CardSection>
  );
};

export default MockGroupCard;
