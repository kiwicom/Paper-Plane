import useFirestore from "./useFirestore";
import {
  collection,
  FirestoreError,
  query,
  QuerySnapshot,
} from "@firebase/firestore";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { UseQueryResult } from "react-query";
import { Mock } from "../types";

const useGetMockCollection = (
  projectId: string,
  mockGroupId: string
): UseQueryResult<QuerySnapshot<Mock>, FirestoreError> => {
  const firestore = useFirestore();
  const ref = query(
    collection(
      firestore,
      `projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection`
    )
  );
  return useFirestoreQuery(
    [`projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection`],
    ref,
    {
      subscribe: true,
    },
    { enabled: Boolean(projectId && mockGroupId) }
  );
};

export default useGetMockCollection;
