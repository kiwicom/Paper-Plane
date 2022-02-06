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
      },
    }
  );
  const collectionMutation = useFirestoreCollectionMutation<Project>(
    ref as CollectionReference<Project>
  );

  return projectId ? documentMutation : collectionMutation;
};

export default useProjectMutation;
