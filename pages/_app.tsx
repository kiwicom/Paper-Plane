import { ReactElement } from "react";
import type { AppProps } from "next/app";
import styled from "styled-components";
import Grid from "@kiwicom/orbit-components/lib/utils/Grid";
import Navbar from "../components/Navbar";
import ThemeProvider from "@kiwicom/orbit-components/lib/ThemeProvider";
import { defaultTheme } from "@kiwicom/orbit-components";
import "normalize.css/normalize.css";
import { AuthProvider } from "../components/contexts/Auth";
import { QueryClientProvider } from "react-query";
import JSONSchemaFaker from "json-schema-faker";
import Chance from "chance";
import firebase from "../utils/firebase";
import Faker from "@faker-js/faker";
import queryClient from "../utils/queryClient";

const NavContainer = styled.header`
  z-index: 99;
  position: relative;
`;

const GridWrapper = styled(Grid)`
  min-height: 100vh;
`;

// eslint-disable-next-line no-unused-expressions,babel/no-unused-expressions
firebase;
JSONSchemaFaker.extend("chance", () => new Chance(42));
JSONSchemaFaker.extend("faker", () => Faker);
JSONSchemaFaker.option({
  minItems: 1,
  maxItems: 2,
  ignoreMissingRefs: true,
  failOnInvalidTypes: false,
  failOnInvalidFormat: false,
  useExamplesValue: true,
  reuseProperties: true,
  alwaysFakeOptionals: true,
});

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <GridWrapper rows="64px 1fr">
            <NavContainer>
              <Navbar />
            </NavContainer>
            <Component {...pageProps} />
          </GridWrapper>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
