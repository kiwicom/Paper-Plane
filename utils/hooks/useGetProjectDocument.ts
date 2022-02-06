import useFirestore from "./useFirestore";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
} from "@firebase/firestore";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { UseQueryResult } from "react-query";
import { Project } from "../types";

const useGetProjectDocument = (
  projectId?: string
): UseQueryResult<DocumentSnapshot<Project>, FirestoreError> | null => {
  const firestore = useFirestore();
  const ref = doc(firestore, "projects", projectId || "0");

  return useFirestoreDocument<Project, DocumentSnapshot<Project>>(
    ["projects", projectId],
    ref as DocumentReference<Project>,
    { subscribe: true }
  );
};

export default useGetProjectDocument;
