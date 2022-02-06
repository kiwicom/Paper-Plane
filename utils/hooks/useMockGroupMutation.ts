import useFirestore from "./useFirestore";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  FirestoreError,
  WithFieldValue,
} from "@firebase/firestore";
import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { MockGroup } from "../types";
import { UseMutationResult } from "react-query";
import queryClient from "../queryClient";

/**
 * Mutates existing mock group or adds a new one if mockGroupId not provided
 */
const useMockGroupMutation = (
  projectId: string,
  mockGroupId?: string
): UseMutationResult<
  void | DocumentReference<MockGroup>,
  FirestoreError,
  WithFieldValue<MockGroup>
> => {
  const firestore = useFirestore();
  const ref = collection(
    firestore,
    `projects/${projectId}/mockGroupCollection`
  );
  const documentMutation = useFirestoreDocumentMutation<MockGroup>(
    doc<MockGroup>(ref as CollectionReference<MockGroup>, mockGroupId || "0"),
    {
      merge: true,
    },
    {
      onSuccess: () => {
        queryClient.removeQueries();
      },
    }
  );
  const collectionMutation = useFirestoreCollectionMutation<MockGroup>(
    ref as CollectionReference<MockGroup>
  );

  return mockGroupId ? documentMutation : collectionMutation;
};

export default useMockGroupMutation;
