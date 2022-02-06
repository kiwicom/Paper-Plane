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
  mockUrl.host = webUrlBase;
  mockUrl.searchParams.set(mock.apiOverrideUrlParamName, mockApiBase);

  // strip protocol to let browser figure whenever to chose http or https (useful for localhost)
  return `//${mockUrl.toString().replace(/(^\w+:|^)\/\//, "")}`;
};

export default createMockHref;
