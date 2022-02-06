import styled from "styled-components";
import Grid from "@kiwicom/orbit-components/lib/utils/Grid";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import { Box, Skeleton, Loading } from "@kiwicom/orbit-components";

const PageGrid = styled(Grid)`
  width: 100%;
  min-height: 100%;
  height: fit-content;
  background: ${({ theme }) => theme.orbit.paletteCloudLight};
`;

const PageContent = styled.aside`
  background: ${({ theme }) => theme.orbit.paletteWhite};
  padding: ${({ theme }) => theme.orbit.spaceXLarge};
`;

const layoutOptions = {
  maxWidth: "100%",
  columns: "2fr minmax(272px, 5fr)",
};

type LayoutProps = {
  children: JSX.Element;
  sidebar: JSX.Element;
  isLoading?: boolean;
};

const Layout = ({ sidebar, children, isLoading }: LayoutProps): JSX.Element => {
  return (
    <PageGrid {...layoutOptions}>
      <Grid rows="1fr auto auto">
        {isLoading ? (
          <Stack justify="start" direction="column" align="center">
            <Box padding="XLarge" width="100%">
              <Stack direction="column" spacing="XXLarge">
                <Skeleton height={70} width={300} />
                <Skeleton height={60} width={400} />
              </Stack>
            </Box>
          </Stack>
        ) : (
          sidebar
        )}
      </Grid>
      <PageContent>
        {isLoading ? (
          <Stack justify="center" direction="column" align="center">
            <Box padding="XLarge" width="100%">
              <Loading type="pageLoader" />
            </Box>
          </Stack>
        ) : (
          children
        )}
      </PageContent>
    </PageGrid>
  );
};

export default Layout;
