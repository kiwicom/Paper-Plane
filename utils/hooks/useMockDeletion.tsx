import useFirestore from "./useFirestore";
import {
  collection,
  doc,
  DocumentReference,
  FirestoreError,
} from "@firebase/firestore";
import { useFirestoreDocumentDeletion } from "@react-query-firebase/firestore";
import { Mock } from "../types";
import { UseMutationResult } from "react-query";
import { useRouter } from "next/router";
import CheckCircle from "@kiwicom/orbit-components/lib/icons/CheckCircle";
import { createToast } from "@kiwicom/orbit-components/lib/Toast";

/**
 * Deletes existing mock
 */
const useMockDeletion = (
  projectId: string,
  mockGroupId: string,
  mockId?: string
): UseMutationResult<void | DocumentReference<Mock>, FirestoreError, void> => {
  const { push } = useRouter();
  const firestore = useFirestore();
  const collectionReference = collection(
    firestore,
    `projects/${projectId}/mockGroupCollection/${mockGroupId}/mockCollection`
  );
  const documentReference = doc(collectionReference, mockId || "0");

  return useFirestoreDocumentDeletion(documentReference, {
    onSuccess: () => {
      createToast(`Mock deleted`, { icon: <CheckCircle /> });
      push(`/projects/${projectId}`);
    },
  });
};

export default useMockDeletion;
