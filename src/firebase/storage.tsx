import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { Interface } from "readline";
import { storage } from "./firebase";

export const uploadImage = (image: File, location: string, bookId: string) => {
  const imageRef = ref(storage, `${location}/${bookId}`);
  if (image === undefined) {
    return;
  }
  uploadBytes(imageRef, image).then(() => {
    return {
      status: 200,
      message: "image has been uploaded",
    };
  });
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
