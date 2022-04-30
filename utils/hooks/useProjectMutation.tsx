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
import { Project } from "../types";
import { UseMutationResult } from "react-query";
import queryClient from "../queryClient";
import CheckCircle from "@kiwicom/orbit-components/lib/icons/CheckCircle";
import { createToast } from "@kiwicom/orbit-components/lib/Toast";
import { useRouter } from "next/router";

/**
 * Mutates existing project or adds a new one if projectId not provided
 */
const useProjectMutation = (
  projectId?: string
): UseMutationResult<
  void | DocumentReference<Project>,
  FirestoreError,
  WithFieldValue<Project>
> => {
  const { push } = useRouter();
  const firestore = useFirestore();
  const ref = collection(firestore, "projects");
  const documentMutation = useFirestoreDocumentMutation<Project>(
    doc<Project>(ref as CollectionReference<Project>, projectId || "0"),
    {
      merge: true,
    },
    {
      onSuccess: () => {
        queryClient.removeQueries();
        createToast(`Project updated`, { icon: <CheckCircle /> });
        push("/projects");
      },
    }
  );
  const collectionMutation = useFirestoreCollectionMutation<Project>(
    ref as CollectionReference<Project>,
    {
      onSuccess: () => {
        queryClient.removeQueries();
        createToast(`Project created`, { icon: <CheckCircle /> });
        push("/projects");
      },
    }
  );

  return projectId ? documentMutation : collectionMutation;
};

export default useProjectMutation;
