import useFirestore from "./useFirestore";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
} from "@firebase/firestore";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { UseQueryResult } from "react-query";
import { MockGroup } from "../types";

const useGetMockGroupDocument = (
  projectId: string,
  mockGroupId?: string
): UseQueryResult<DocumentSnapshot<MockGroup>, FirestoreError> => {
  const firestore = useFirestore();
  const ref = doc(
    firestore,
    `projects/${projectId}/mockGroupCollection`,
    mockGroupId || "0"
  );
  return useFirestoreDocument<MockGroup, DocumentSnapshot<MockGroup>>(
    [`projects/${projectId}/mockGroupCollection`, mockGroupId],
    ref as DocumentReference<MockGroup>,
    { subscribe: true },
    { enabled: Boolean(projectId) }
  );
};

export default useGetMockGroupDocument;
