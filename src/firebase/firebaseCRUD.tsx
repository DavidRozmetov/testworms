import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Book } from "../interfaces/Interfaces";
import { deleteThumbnail } from "./storage";
import { resolve } from "path";

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

//readDocument("users", auth.currentUser)
export const readDocument = async (
  collectionName: string,
  fieldName: string
) => {
  const docRef = doc(db, collectionName, fieldName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { status: "200", message: docSnap?.data() };
  } else {
    // doc.data() will be undefined in this case
    return { status: "400", message: "No such document!" };
  }
};

export const updateData = async (
  collectionName: string,
  document: string,
  data: any
): Promise<any> => {
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

export const getUidFromId = async (
  collectionName: string,
  keyName: string,
  id: string
): Promise<{
  status: number;
  message: string;
}> => {
  let uid: string = "";

  const q = query(collection(db, collectionName), where(keyName, "==", id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    uid = doc.id;
  });

  return {
    status: 200,
    message: uid,
  };
};
//read
export const readBooksData = async (): Promise<any> => {
  const booksCollection: { [key: string]: any } = [];
  let booksArray: {
    bookUID: string;
    bookId: string;
    bookName: string;
    stage: string | undefined;
  }[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((doc) => {
      const bookData = {
        bookUID: doc.id,
        bookId: doc.data().bookId,
        bookName: doc.data().bookName,
        stage: doc.data().stage,
      };
      booksArray.push(bookData);
    });

    return {
      status: 200,
      message: {
        books: booksArray,
      },
    };
  } catch (e) {
    return {
      status: 400,
      message: "Something went wrong! !" + e,
    };
  }
};

export const deleteBook = async (bookId: string): Promise<any> => {
  // if it has a thumbnail, delete thumbnail
  // async (): Promise<any>
  deleteThumbnail(bookId);

  // delete questions with the same book id
  const deleteQuestionsAndBook = async () => {
    const q = query(collection(db, "questions"), where("bookId", "==", bookId));
    const b = query(collection(db, "books"), where("bookId", "==", bookId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (question) => {
      // doc.data() is never undefined for query doc snapshots
      await deleteDoc(doc(db, "questions", question.id));
      // await deleteDoc(question);
      // const questionRef = doc(db, "questions", question.id);
    });

    // await deleteDoc(doc(db, "books", ))

    const bookSnapshot = await getDocs(b);
    bookSnapshot.forEach(async (book) => {
      await deleteDoc(doc(db, "books", book.id));
    });

    //delete book
  };

  deleteQuestionsAndBook();

  return {
    status: 400,
    message: "Book has been deleted",
  };
};

export const checkForTheSameName = async (bookObject: Book) => {
  //get all the books data
  // convert them into an array
  let existingBookNames: string[] = [];
  const b = query(collection(db, "books"));
  const booksSnapshot = await getDocs(b);

  booksSnapshot.forEach(async (book) => {
    existingBookNames.push(book.data().bookName);
  });

  //checks if the names match

  // if not proceed
  //else give alert
  return existingBookNames.includes(bookObject.bookName);
};

export const readQuestions = async (bookId: string): Promise<any> => {
  let questions: any = [];
  const q = query(collection(db, "questions"), where("bookId", "==", bookId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    questions.push(doc.data());
  });
  return questions;
};

export const readBookData = async (bookId: string) => {
  let questions: any;
  const q = query(collection(db, "books"), where("bookId", "==", bookId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    questions = doc.data();
  });
  return questions;
};
