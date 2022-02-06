import useFirestore from "./useFirestore";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
} from "@firebase/firestore";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { UseQueryResult } from "react-query";
import { Mock } from "../types";

const useGetMockDocument = (
  projectId: string,
  mockGroupId: string,
  mockId?: string
): UseQueryResult<DocumentSnapshot<Mock>, FirestoreError> | null => {
  const firestore = useFirestore();
  const ref = doc(
    firestore,
    `projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection`,
    mockId || "0"
  );
  return useFirestoreDocument<Mock, DocumentSnapshot<Mock>>(
    [
      `projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection`,
      mockId,
    ],
    ref as DocumentReference<Mock>,
    { subscribe: true },
    { enabled: Boolean(projectId && mockGroupId) }
  );
};

export default useGetMockDocument;
