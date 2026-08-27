import { db } from '../config/firebase';
import { 
  collection, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc, query, where, orderBy 
} from 'firebase/firestore';

export const murtiApi = {
  getMurtis: async (params = {}) => {
    try {
      const q = query(collection(db, 'murtis'));
      
      const querySnapshot = await getDocs(q);
      let murtis = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client-side text search replacing AI NLP search
      if (params.q) {
        const searchLower = params.q.toLowerCase();
        murtis = murtis.filter(m => 
          m.name?.toLowerCase().includes(searchLower) ||
          m.description?.toLowerCase().includes(searchLower) ||
          m.material?.toLowerCase().includes(searchLower)
        );
      }
      
      if (params.material) {
        murtis = murtis.filter(m => m.material === params.material);
      }
      if (params.deity) {
        murtis = murtis.filter(m => m.deity === params.deity);
      }

      if (params.sort) {
        if (params.sort === 'price_asc') murtis.sort((a,b) => (a.price || 0) - (b.price || 0));
        if (params.sort === 'price_desc') murtis.sort((a,b) => (b.price || 0) - (a.price || 0));
        if (params.sort === 'popular') murtis.sort((a,b) => (b.views || 0) - (a.views || 0));
      }

      return { data: { murtis } };
    } catch (err) {
      console.error("Firebase getMurtis Error:", err);
      throw err;
    }
  },
  
  getMurtiById: async (id) => {
    try {
      const docRef = doc(db, 'murtis', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        throw new Error("Murti not found");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  
  createMurti: async (murtiDataInput, files = []) => {
    try {
      let imageUrls = [];
      
      for (const file of files) {
        if (file && typeof file === 'object' && file.name) {
          // Bypassing Firebase Storage completely due to billing requirements.
          // Compressing image and storing it as a Base64 string directly in Firestore.
          const base64Url = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                let scaleSize = 1;
                if (img.width > MAX_WIDTH) {
                  scaleSize = MAX_WIDTH / img.width;
                }
                canvas.width = img.width * scaleSize;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Convert to compressed JPEG (70% quality)
                resolve(canvas.toDataURL('image/jpeg', 0.7)); 
              };
              img.onerror = (err) => reject(new Error("Failed to read image file"));
              img.src = e.target.result;
            };
            reader.onerror = (err) => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
          });
          
          imageUrls.push(base64Url);
        }
      }

      const murtiData = {
        name: murtiDataInput.name,
        deity: murtiDataInput.deity,
        material: murtiDataInput.material,
        height_cm: Number(murtiDataInput.height_cm),
        width_cm: Number(murtiDataInput.width_cm) || null,
        weight_kg: Number(murtiDataInput.weight_kg) || null,
        availability: murtiDataInput.availability,
        description: murtiDataInput.description,
        price: Number(murtiDataInput.price) || null,
        primary_image: imageUrls.length > 0 ? imageUrls[0] : null,
        images: imageUrls,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'murtis'), murtiData);
      return { data: { id: docRef.id, ...murtiData } };
    } catch (err) {
      console.error("Firebase createMurti Error:", err);
      throw err;
    }
  },
  
  deleteMurti: async (id) => {
    try {
      await deleteDoc(doc(db, 'murtis', id));
      return { data: { message: "Murti deleted successfully" } };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};

export const bookingApi = {
  createBooking: async (data) => {
    try {
      const reference = 'MK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const bookingData = {
        ...data,
        reference,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      return { data: { id: docRef.id, ...bookingData } };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  
  trackBooking: async (reference, email) => {
    try {
      const q = query(
        collection(db, 'bookings'), 
        where("reference", "==", reference),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { data: { id: doc.id, ...doc.data() } };
      } else {
        throw new Error("Booking not found with provided reference and email.");
      }
    } catch (err) {
      console.error(err);
      throw err; 
    }
  },
  
  getAllBookings: async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { data: bookings };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  
  updateStatus: async (id, status) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status });
      return { data: { id, status } };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};

export const authApi = {
  login: async () => { throw new Error("Use firebaseAuth.js directly"); },
  register: async () => { throw new Error("Use firebaseAuth.js directly"); },
  verifyOtp: async () => { throw new Error("PyOTP Removed. Use firebaseAuth.js directly"); }
};

export const catalogApi = {
  exportXmlUrl: "#", 
  importXml: async (formData) => {
     throw new Error("XML Import is currently disabled in the Serverless version.");
  },
  importXmlText: async (xmlContent) => {
     throw new Error("XML Import is currently disabled in the Serverless version.");
  }
};
