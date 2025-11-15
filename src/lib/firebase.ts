import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6qyPyr3tGGTjC3vBZ88jDiElojZebxjs",
  authDomain: "agritech-dff7a.firebaseapp.com",
  projectId: "agritech-dff7a",
  storageBucket: "agritech-dff7a.firebasestorage.app",
  messagingSenderId: "80507635582",
  appId: "1:80507635582:web:4b022f85c55c4e024a552f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
