// /firebase/firestore.js
import { getFirestore } from "firebase/firestore"; // ✅ 공식 경로
import { app } from "./firebasedb";

const db = getFirestore(app);
export default db;
export { db };