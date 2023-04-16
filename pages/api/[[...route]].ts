/* eslint-disable babel/camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import cors from "cors";
import initMiddleware from "../../utils/initMiddleware";
import admin from "firebase-admin";
import parseRequestRoute from "../../utils/parseRequestRoute";
import mergeApiMocks from "../../utils/mergeApiMocks";
import { EndpointMock, Mock, MockGroup, Project } from "../../utils/types";
import { pathToRegexp } from "path-to-regexp";

// Initialize the cors middleware
const corsMiddleware = initMiddleware(cors());

// serviceAccount available only locally
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_PAPER_PLANE;

const app =
  admin.apps[0] ||
  (serviceAccount
    ? admin.initializeApp(
        {
          credential: admin.credential.cert(
            JSON.parse(serviceAccount as string)
          ),
        },
        "Paper Plane Admin"
      )
    : admin.initializeApp());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
): Promise<void> {
  const { route } = req.query;
  await corsMiddleware(req, res);

  const parsedRequest = parseRequestRoute(route);

  if (!parsedRequest) {
    return res.status(400).json({ detail: "Invalid request" });
  }
  const { projectId, mockGroupId, mockId, endpoint } = parsedRequest;

  const firestore = app.firestore();

  const projectRef = firestore.doc(`projects/${projectId}`);
  const mockGroupRef = firestore.doc(
    `projects/${projectId}/mockGroupCollection/${mockGroupId}`
  );
  const mockRef = firestore.doc(
    `projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection/${mockId}`
  );
  const [project, mockGroup, mock] = (
    await firestore.getAll(projectRef, mockGroupRef, mockRef)
  ).map((docSnapshot) => docSnapshot.data()) as [Project, MockGroup, Mock];

  const mergedMockApiCollection = mergeApiMocks(
    project.apiMockCollection,
    mockGroup.apiMockCollection,
    mock.apiMockCollection
  );

  const endpointMock = mergedMockApiCollection.reduce<null | EndpointMock>(
    (acc, apiMock) => {
      const matchingEndpointMock = apiMock.endpointMockCollection.find((em) => {
        const regexp = pathToRegexp(
          em.endpointPath.replaceAll("{", ":").replaceAll("}", "")
        );
        return regexp.test(endpoint) && em.method === req.method?.toLowerCase();
      });
      if (matchingEndpointMock) {
        return matchingEndpointMock;
      }
      return acc;
    },
    null
  );

  if (!endpointMock) {
    return res.status(404).json({ detail: "Mock not found" });
  }

  return res.status(200).json(endpointMock.responseObject);
}
