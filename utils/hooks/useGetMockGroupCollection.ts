import useFirestore from "./useFirestore";
import {
  collection,
  FirestoreError,
  query,
  QuerySnapshot,
} from "@firebase/firestore";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { UseQueryResult } from "react-query";
import { MockGroup } from "../types";

const useGetMockGroupCollection = (
  projectId: string
): UseQueryResult<QuerySnapshot<MockGroup>, FirestoreError> => {
  const firestore = useFirestore();
  const ref = query(
    collection(firestore, `projects/${projectId}/mockGroupCollection`)
  );
  return useFirestoreQuery(
    [`projects/${projectId}/mockGroupCollection`],
    ref,
    {
      subscribe: true,
    },
    { enabled: Boolean(projectId) }
  );
};

export default useGetMockGroupCollection;
