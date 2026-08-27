import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

const sampleMurtis = [
  {
    name: "Dagadusheth Halwai Ganpati Replica",
    deity: "Ganpati",
    material: "Shadu Mati",
    height_cm: 60,
    width_cm: 40,
    weight_kg: 15,
    availability: "Available",
    description: "Beautiful handcrafted eco-friendly Dagadusheth Halwai Ganpati idol made of pure Shadu Mati.",
    price: 5500,
    main_image_url: "https://images.unsplash.com/photo-1567117565985-2e65c92f152d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString(),
    views: 120
  },
  {
    name: "Lalbaugcha Raja Replica",
    deity: "Ganpati",
    material: "Fiber",
    height_cm: 120,
    width_cm: 70,
    weight_kg: 25,
    availability: "Available",
    description: "Premium lightweight fiber Lalbaugcha Raja murti with intricate detailing and vibrant colors.",
    price: 15000,
    main_image_url: "https://images.unsplash.com/photo-1631580194411-bd388f61efde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString(),
    views: 345
  },
  {
    name: "Ashtabhuja Devi Murti",
    deity: "Devi",
    material: "Marble",
    height_cm: 90,
    width_cm: 50,
    weight_kg: 40,
    availability: "Available",
    description: "Exquisite carved marble Ashtabhuja Devi idol, polished to perfection with gold accents.",
    price: 25000,
    main_image_url: "https://images.unsplash.com/photo-1601366114885-3bba3043831b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString(),
    views: 95
  },
  {
    name: "Titwala Mahaganpati",
    deity: "Ganpati",
    material: "P.O.P",
    height_cm: 45,
    width_cm: 30,
    weight_kg: 5,
    availability: "Available",
    description: "Classic Titwala Mahaganpati design, crafted from high-quality Plaster of Paris with fine finishing.",
    price: 1200,
    main_image_url: "https://images.unsplash.com/photo-1563810166292-06b24de50d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString(),
    views: 45
  }
];

async function seed() {
  console.log("Seeding Database...");
  try {
    for (const murti of sampleMurtis) {
      const docRef = await addDoc(collection(db, 'murtis'), murti);
      console.log(`Added Murti with ID: ${docRef.id}`);
    }
    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();
