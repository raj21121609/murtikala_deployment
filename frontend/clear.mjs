import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-rCKbo2j7bjHjMImzXc15UXcszq1Xxn0",
  authDomain: "murtikala-2ef8c.firebaseapp.com",
  projectId: "murtikala-2ef8c",
  storageBucket: "murtikala-2ef8c.firebasestorage.app",
  messagingSenderId: "40315062931",
  appId: "1:40315062931:web:1b3756201c3e99b7eb5b66"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearDb() {
  console.log("Clearing Database...");
  try {
    const querySnapshot = await getDocs(collection(db, 'murtis'));
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(db, 'murtis', document.id));
      console.log(`Deleted Murti with ID: ${document.id}`);
    }
    console.log("Cleared successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

clearDb();
