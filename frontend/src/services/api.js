import { db } from '../config/firebase';
import { 
  collection, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc, query, where, orderBy 
} from 'firebase/firestore';

export const murtiApi = {
  getMurtis: async (params = {}) => {
    try {
      const q = query(collection(db, 'murtis'));
      
      const querySnapshot = await getDocs(q);
      let murtis = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const total = data.total_quantity !== undefined 
          ? Number(data.total_quantity) 
          : (data.quantity !== undefined ? Number(data.quantity) : 1);
        const available = data.available_quantity !== undefined 
          ? Number(data.available_quantity) 
          : (data.availability === 'Booked' || data.availability === 'Unavailable' || data.availability === 'Sold Out' ? 0 : total);
        
        return {
          id: doc.id,
          ...data,
          total_quantity: total,
          available_quantity: available,
          availability: available > 0 ? (data.availability || 'Available') : 'Sold Out'
        };
      });

      // Unless includeUnavailable is true (for admin or past booking lookups),
      // only show murtis with available stock to customers
      if (!params.includeUnavailable) {
        murtis = murtis.filter(m => m.available_quantity > 0 && m.availability === 'Available');
      }

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
        const data = docSnap.data();
        const total = data.total_quantity !== undefined 
          ? Number(data.total_quantity) 
          : (data.quantity !== undefined ? Number(data.quantity) : 1);
        const available = data.available_quantity !== undefined 
          ? Number(data.available_quantity) 
          : (data.availability === 'Booked' || data.availability === 'Unavailable' || data.availability === 'Sold Out' ? 0 : total);

        return { 
          data: { 
            id: docSnap.id, 
            ...data,
            total_quantity: total,
            available_quantity: available,
            availability: available > 0 ? (data.availability || 'Available') : 'Sold Out'
          } 
        };
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

      const totalQuantity = Math.max(1, parseInt(murtiDataInput.quantity, 10) || 1);

      const murtiData = {
        name: murtiDataInput.name,
        deity: murtiDataInput.deity,
        material: murtiDataInput.material,
        height_cm: Number(murtiDataInput.height_cm),
        width_cm: Number(murtiDataInput.width_cm) || null,
        weight_kg: Number(murtiDataInput.weight_kg) || null,
        total_quantity: totalQuantity,
        available_quantity: totalQuantity,
        availability: 'Available',
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
  
  getMyBookings: async (email) => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first, client-side
      return { data: bookings };
    } catch (err) {
      console.error('Firebase getMyBookings Error:', err);
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
      const bookingSnap = await getDoc(bookingRef);
      if (!bookingSnap.exists()) {
        throw new Error("Booking not found");
      }
      const bookingData = bookingSnap.data();
      const oldStatus = (bookingData.status || '').toLowerCase();
      const newStatus = (status || '').toLowerCase();

      // Update booking status
      await updateDoc(bookingRef, { status });

      // If this booking has an associated murti_id, sync murti quantity and availability
      if (bookingData.murti_id) {
        try {
          const murtiRef = doc(db, 'murtis', bookingData.murti_id);
          const murtiSnap = await getDoc(murtiRef);
          if (murtiSnap.exists()) {
            const murtiData = murtiSnap.data();
            const total = murtiData.total_quantity !== undefined 
              ? Number(murtiData.total_quantity) 
              : (murtiData.quantity !== undefined ? Number(murtiData.quantity) : 1);
            let currentAvailable = murtiData.available_quantity !== undefined 
              ? Number(murtiData.available_quantity) 
              : (murtiData.availability === 'Booked' || murtiData.availability === 'Sold Out' ? 0 : total);

            let updatedAvailable = currentAvailable;
            let stockChanged = false;

            // Transitioning INTO Confirmed: decrement stock
            if (newStatus === 'confirmed' && oldStatus !== 'confirmed') {
              updatedAvailable = Math.max(0, currentAvailable - 1);
              stockChanged = true;
            }
            // Transitioning OUT of Confirmed (e.g. Declined, Cancelled, Pending): restore stock
            else if (oldStatus === 'confirmed' && newStatus !== 'confirmed') {
              updatedAvailable = Math.min(total, currentAvailable + 1);
              stockChanged = true;
            }

            if (stockChanged) {
              const newAvailability = updatedAvailable > 0 ? 'Available' : 'Sold Out';
              await updateDoc(murtiRef, {
                total_quantity: total,
                available_quantity: updatedAvailable,
                availability: newAvailability
              });
            }
          }
        } catch (murtiErr) {
          console.warn("Could not sync murti stock for booking:", murtiErr);
        }
      }

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
