
import firebasedb from "./firebasedb";
import { getStorage } from "firebase/storage";

const storage = getStorage(firebasedb.firebaseApp);
export default storage;