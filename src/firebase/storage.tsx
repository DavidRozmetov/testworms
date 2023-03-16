import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { Interface } from "readline";
import { storage } from "./firebase";

export const uploadImage = (
  image: File,
  location: string,
  bookId: string,
  progres: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const imageRef = ref(storage, `${location}/${bookId}`);
  if (image === undefined) {
    return;
  }
  const uploadTask = uploadBytesResumable(imageRef, image);

  uploadTask.on("state_changed", (snapshot) => {
    const prog = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );

    setProgress(prog);
  });
  // .then(() => {

  //   return {
  //     status: 200,
  //     message: "image has been uploaded",
  //   };
  // });

  // uploadTask.on('state_changed',
  // (snapshot) => {
  //   // Observe state change events such as progress, pause, and resume
  //   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //   console.log('Upload is ' + progress + '% done');
  //   switch (snapshot.state) {
  //     case 'paused':
  //       console.log('Upload is paused');
  //       break;
  //     case 'running':
  //       console.log('Upload is running');
  //       break;
  //   }
  // },
  // (error) => {
  //   // Handle unsuccessful uploads
  // },
};

export const loadAllImages = (
  folder: string
): Promise<{ name: string; url: string }[]> => {
  return new Promise((resolve, reject) => {
    let thumbnailURLs: {
      name: string;
      url: string;
    }[] = [];
    const imageListRef = ref(storage, `${folder}/`);

    listAll(imageListRef)
      .then((res) => {
        const promises = res.items.map((item) => {
          return getDownloadURL(item).then((url) => {
            const data = {
              name: item.name,
              url: url,
            };

            thumbnailURLs.push(data);
          });
        });
        Promise.all(promises)
          .then(() => {
            resolve(thumbnailURLs);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteThumbnail = (imageId: string) => {
  const desertRef = ref(storage, `thumbnails/${imageId}`);

  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      return {
        status: 200,
        message: "Thumbnail Deleted",
      };
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
};
