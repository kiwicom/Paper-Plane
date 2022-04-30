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
import { Mock } from "../types";
import { UseMutationResult } from "react-query";
import queryClient from "../queryClient";
import { createToast } from "@kiwicom/orbit-components/lib/Toast";
import CheckCircle from "@kiwicom/orbit-components/lib/icons/CheckCircle";
import { useRouter } from "next/router";

/**
 * Mutates existing mock or adds a new one if mockId not provided
 */
const useMockMutation = (
  projectId: string,
  mockGroupId: string,
  mockId?: string
): UseMutationResult<
  void | DocumentReference<Mock>,
  FirestoreError,
  WithFieldValue<Mock>
> => {
  const { push } = useRouter();
  const firestore = useFirestore();
  const ref = collection(
    firestore,
    `projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection`
  );
  const documentMutation = useFirestoreDocumentMutation<Mock>(
    doc<Mock>(ref as CollectionReference<Mock>, mockId || "0"),
    {
      merge: true,
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        createToast(`Mock updated`, { icon: <CheckCircle /> });
        push(`/projects/${projectId}`);
      },
    }
  );
  const collectionMutation = useFirestoreCollectionMutation<Mock>(
    ref as CollectionReference<Mock>,
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        createToast(`Mock created`, { icon: <CheckCircle /> });
        push(`/projects/${projectId}`);
      },
    }
  );

  return mockId ? documentMutation : collectionMutation;
};

export default useMockMutation;
