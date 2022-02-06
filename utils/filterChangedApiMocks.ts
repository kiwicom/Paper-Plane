import { ApiMock } from "./types";
import _ from "lodash";

/**
 * Filters out unchanged api and endpoints mocks
 *
 * @example ```typescript
 * filterChangedApiMocks(originalApiMockCollection, changedApiMockCollection)
 * ```
 *
 * @returns differentiating api mocks and api endpoints
 */
const filterChangedApiMocks = (
  originalApiMockCollection: Array<ApiMock>,
  changedApiMockCollection: Array<ApiMock>
): Array<ApiMock> => {
  return changedApiMockCollection
    .map((changedApiMock): ApiMock => {
      const originalApiMock = originalApiMockCollection.find(
        (apiMock) =>
          apiMock.openAPISchemaUrl === changedApiMock.openAPISchemaUrl
      );

      const changedEndpointMockCollection = _.differenceWith(
        changedApiMock.endpointMockCollection,
        (originalApiMock as ApiMock).endpointMockCollection,
        (a, b) => _.isEqual(_.omit(a, ["validity"]), _.omit(b, ["validity"]))
      );

      return {
        ...changedApiMock,
        endpointMockCollection: changedEndpointMockCollection,
      };
    })
    .filter((apiMock) => apiMock.endpointMockCollection.length);
};

export default filterChangedApiMocks;
