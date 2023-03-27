import { rejects } from "assert";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React from "react";
import { SetStateAction, useState } from "react";
import { Interface } from "readline";
import { storage } from "./firebase";

export function uploadImage(
  image: File,
  location: string,
  bookId: string,
  setProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<{ name: string; url: string }> {
  return new Promise((resolve, reject) => {
    const imageRef = ref(storage, `${location}/${bookId}`);
    let message: {
      status: number;
      message: string;
      data?: object;
    };

    if (image === undefined) {
      message = {
        status: 400,
        message: "something went wrong",
      };
    }
    const uploadTask = uploadBytesResumable(imageRef, image);

    uploadTask.on("state_changed", (snapshot) => {
      const prog = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(prog);
    });

    uploadTask.then(() => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve({
          url: downloadURL,
          name: bookId,
        });
      });
    });
  });
}

export const loadAllImages = (
  folder: string
): Promise<{ name: string; url: string }[]> => {
  return new Promise((resolve, reject) => {
    let thumbnailURLs: {
      name: string;
      url: string;
    }[] = [];
    const imageRef = ref(storage, `${folder}/`);

    listAll(imageRef)
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

export const loadImage = (
  folder: string,
  imageName: string
): Promise<{ name: string; url: string }> => {
  return new Promise((resolve, reject) => {
    let thumbnailData: {
      name: string;
      url: string;
    };
    const imageRef = ref(storage, `${folder}/${imageName}`);

    return getDownloadURL(imageRef).then((url) => {
      thumbnailData = {
        name: imageName,
        url: url,
      };

      Promise.resolve(thumbnailData).catch((error) => {
        reject(error);
      });
    });
  });
};

export const deleteThumbnail = (
  imageId: string,
  thumbnailNameArray?: string[],
  setThumbnailNameArray?: React.Dispatch<React.SetStateAction<string[]>>
): Promise<{ status: number; message: string }> => {
  return new Promise((resolve, reject) => {
    const desertRef = ref(storage, `thumbnails/${imageId}`);
    // Delete the file

    if (thumbnailNameArray && setThumbnailNameArray) {
      thumbnailNameArray.forEach((item, index) => {
        if (item === imageId) thumbnailNameArray.splice(index, 1);
      });
      setThumbnailNameArray(thumbnailNameArray);
    }
    deleteObject(desertRef)
      .then(() => {
        resolve({
          status: 200,
          message: "Thumbnail Deleted",
        });
      })
      .catch((error) => {
        resolve({
          status: 400,
          message: "Couldn't delete the thumbnail!",
        });
      });
  });
};
