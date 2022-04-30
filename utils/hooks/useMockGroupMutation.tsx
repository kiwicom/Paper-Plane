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
import { useRouter } from "next/router";
import { createToast } from "@kiwicom/orbit-components/lib/Toast";
import CheckCircle from "@kiwicom/orbit-components/lib/icons/CheckCircle";

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
  const { push } = useRouter();
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
        queryClient.invalidateQueries();
        createToast(`Mock Group updated`, { icon: <CheckCircle /> });
        push(`/projects/${projectId}`);
      },
    }
  );
  const collectionMutation = useFirestoreCollectionMutation<MockGroup>(
    ref as CollectionReference<MockGroup>,
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        createToast(`Mock Group created`, { icon: <CheckCircle /> });
        push(`/projects/${projectId}`);
      },
    }
  );

  return mockGroupId ? documentMutation : collectionMutation;
};

export default useMockGroupMutation;
