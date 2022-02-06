import { ApiMock } from "./types";
import _ from "lodash";

/**
 * Merges API mock collections from left (most general) to right (most specific)
 *
 * @example ```typescript
 * mergeApiMocks(projectApiMockCollection, mockGroupApiMockCollection, mockApiMockCollection)
 * ```
 *
 * @returns merged API mock collection
 */
const mergeApiMocks = (
  projectApiMockCollection: Array<ApiMock>,
  mockGroupApiMockCollection?: Array<ApiMock>,
  mockApiMockCollection?: Array<ApiMock>
): Array<ApiMock> => {
  return projectApiMockCollection.map((projectApiMock): ApiMock => {
    const mockGroupApiMock = mockGroupApiMockCollection?.find(
      (apiMock) => apiMock.openAPISchemaUrl === projectApiMock.openAPISchemaUrl
    );
    const mockApiMock = mockApiMockCollection?.find(
      (apiMock) => apiMock.openAPISchemaUrl === projectApiMock.openAPISchemaUrl
    );
    const [projectEndpointMocks, mockGroupEndpointMocks, mockEndpointMocks] = [
      projectApiMock.endpointMockCollection,
      mockGroupApiMock?.endpointMockCollection,
      mockApiMock?.endpointMockCollection,
    ].map((endpointMockCollection) =>
      _.keyBy(endpointMockCollection, "endpointPath")
    );

    const endpointMockCollection = Object.values(
      _.defaults(
        mockEndpointMocks,
        mockGroupEndpointMocks,
        projectEndpointMocks
      )
    );

    return { ...projectApiMock, endpointMockCollection };
  });
};

export default mergeApiMocks;
