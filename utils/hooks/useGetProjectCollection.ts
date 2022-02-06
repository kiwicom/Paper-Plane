import useFirestore from "./useFirestore";
import {
  collection,
  FirestoreError,
  query,
  QuerySnapshot,
} from "@firebase/firestore";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { UseQueryResult } from "react-query";
import { Project } from "../types";

const useGetProjectCollection = (): UseQueryResult<
  QuerySnapshot<Project>,
  FirestoreError
> => {
  const firestore = useFirestore();
  const ref = query(collection(firestore, "projects"));
  return useFirestoreQuery(["projects"], ref, {
    subscribe: true,
  });
};

export default useGetProjectCollection;
