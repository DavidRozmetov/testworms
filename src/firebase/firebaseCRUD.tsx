import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// createData("users", { first: "david", last: "Fah", born: 1997,});
export const createData = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return {
      status: 200,
      message: "Data added successfully!",
    };
  } catch (e) {
    return {
      status: 400,
      message: "Something went wrong! !" + e,
    };
  }
};

// readData("users")
export const readData = async (collectionName: string) => {
  const dataCollection: { [key: string]: any } = {};
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      dataCollection[doc.id] = doc.data();
    });

    return {
      status: 200,
      message: dataCollection,
    };
  } catch (e) {
    return {
      status: 400,
      message: "Something went wrong! !" + e,
    };
  }
};

// await updateData("users", "ywitspr6NBkKE0eVkAzx", {  first: "Montira", last: "Fahhh",})
export const updateData = async (
  collectionName: string,
  document: string,
  data: any
) => {
  const dataRef = doc(db, collectionName, document);

  try {
    await updateDoc(dataRef, data);
    return {
      status: 200,
      message: "Data updated successfully",
    };
  } catch (e) {
    return {
      status: 400,
      message: "Something went wrong! !" + e,
    };
  }
};

// await deleteData("users", "4ITM2qTan7g86oBy7u5D")
export const deleteData = async (collectionName: string, document: string) => {
  try {
    await deleteDoc(doc(db, collectionName, document));
    return {
      status: 200,
      message: "Data deleted successfully",
    };
  } catch (e) {
    return {
      status: 400,
      message: "Something went wrong! !" + e,
    };
  }
};
