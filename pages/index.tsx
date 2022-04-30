import type { NextPage } from "next";
import styled from "styled-components";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import PaperPlaneLogo from "/public/PaperPlaneLogo1280x929.png";
import Image from "next/image";
import { Box } from "@kiwicom/orbit-components";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useAuth } from "../components/contexts/Auth";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import TextLink from "@kiwicom/orbit-components/lib/TextLink";
import GitHubLogo from "/public/GitHub-Logo-32x32.png";

const Wrapper = styled.div`
  background: ${({ theme }) => theme.orbit.paletteProductNormal};
  display: flex;
`;

const StyledPaperPlaneHeading = styled.text`
  font-size: 100px;
  line-height: 100px;
`;

const firebaseUiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/projects",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};

const Home: NextPage = () => {
  const auth = useAuth();

  return (
    <Wrapper>
      <Stack direction="column" align="center" justify="start">
        <Box maxWidth="90vh">
          <Image src={PaperPlaneLogo} alt="Paper Plane Logo" />
        </Box>
        <Heading align="center" inverted type="display">
          <StyledPaperPlaneHeading>Paper Plane</StyledPaperPlaneHeading>
        </Heading>
        {!auth && (
          <StyledFirebaseAuth
            uiConfig={firebaseUiConfig}
            firebaseAuth={getAuth()}
          />
        )}
      </Stack>
      <Box position="fixed" bottom="20px" right="20px">
        <TextLink
          type="secondary"
          href="https://github.com/kiwicom/Paper-Plane"
        >
          <Image src={GitHubLogo} width="42px" height="42px" alt="GitHub" />
        </TextLink>
      </Box>
    </Wrapper>
  );
};

export default Home;
