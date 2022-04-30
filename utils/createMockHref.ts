import { Mock } from "./types";

const createMockHref = (
  mock: Mock,
  webUrlBase: string,
  projectId: string,
  mockGroupId: string,
  mockId: string
): string => {
  const mockApiBase = `${window.location.origin}/api/projectId/${projectId}/mockGroupId/${mockGroupId}/mockId/${mockId}`;

  const mockUrl: URL = new URL(mock.clientUrl);
  const { protocol, host } = new URL(webUrlBase);
  mockUrl.host = host;
  mockUrl.protocol = protocol;
  mockUrl.searchParams.set(mock.apiOverrideUrlParamName, mockApiBase);

  return mockUrl.toString();
};

export default createMockHref;
