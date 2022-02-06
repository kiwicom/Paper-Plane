import { getFirestore } from "@firebase/firestore";
import { Firestore } from "firebase/firestore";
import firebase from "../firebase";

const useFirestore = (): Firestore => getFirestore(firebase);

export default useFirestore;
