import { ReactElement } from "react";
import transition from "@kiwicom/orbit-components/lib/utils/transition";
import mq from "@kiwicom/orbit-components/lib/utils/mediaQuery";
import LinkList from "@kiwicom/orbit-components/lib/LinkList";
import TextLink from "@kiwicom/orbit-components/lib/TextLink";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import PaperPlaneLogo from "/public/PaperPlaneLogo640x464.png";
import styled, { css } from "styled-components";
import Image from "next/image";
import { useAuth } from "./contexts/Auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useRouter } from "next/router";
import Tooltip from "@kiwicom/orbit-components/lib/primitives/TooltipPrimitive";
import Box from "@kiwicom/orbit-components/lib/Box";

const StyledNavigationBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.orbit.paletteProductDark};
  box-shadow: ${({ theme }) => theme.orbit.boxShadowFixed};
  padding: ${({ theme }) => theme.orbit.spaceSmall};
  box-sizing: border-box;
  z-index: 700;
  transition: ${transition(["transform"], "normal", "ease-in-out")};
  ${mq.tablet(css`
    height: 64px;
  `)};
`;

const AvatarImg = styled.img`
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const Navbar = (): ReactElement => {
  const auth = useAuth();
  const { push } = useRouter();

  const logoutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(() => push("/"));
  };

  return (
    <StyledNavigationBar>
      <Stack direction="row" align="center" justify="center">
        <TextLink href="/">
          <Image
            src={PaperPlaneLogo}
            width={115}
            height={84}
            alt="Paper Plane Logo"
          />
        </TextLink>
        {auth && (
          <LinkList direction="row">
            <TextLink type="white" href="/projects">
              Projects
            </TextLink>
          </LinkList>
        )}
        <Stack inline>
          {auth && (
            <Stack justify="center" align="center" inline>
              <Tooltip content={auth.email}>
                <AvatarImg src={auth.photoURL as string} />
              </Tooltip>
              <Box padding={{ right: "medium" }}>
                <TextLink type="white" onClick={logoutHandler}>
                  Logout
                </TextLink>
              </Box>
            </Stack>
          )}
        </Stack>
      </Stack>
    </StyledNavigationBar>
  );
};

export default Navbar;
