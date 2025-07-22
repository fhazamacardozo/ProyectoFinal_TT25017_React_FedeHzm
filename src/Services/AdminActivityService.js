import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../FireBaseConfig";

export async function getRecentProductActivities(max = 5) {
    const q = query(collection(db, "activity_products"), orderBy("timestamp", "desc"), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getRecentUserActivities(max = 5) {
    const q = query(collection(db, "activity_users"), orderBy("timestamp", "desc"), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
