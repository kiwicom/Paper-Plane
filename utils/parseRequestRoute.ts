type ParsedRoute = {
  projectId: string;
  mockGroupId: string;
  mockId: string;
  endpoint: string;
};

const parseRequestRoute = (
  requestRoute: string | string[]
): ParsedRoute | null => {
  if (!Array.isArray(requestRoute)) {
    return null;
  }
  const [, projectId, , mockGroupId, , mockId, ...endpointRoute] = requestRoute;

  const endpoint = `/${endpointRoute.join("/")}`;

  return {
    projectId,
    mockGroupId,
    mockId,
    endpoint,
  };
};

export default parseRequestRoute;
