import { BigHead } from "@bigheads/core";
import { onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

interface Props {
  firstName: string;
  lastName: string;
}

type Accessory = "none" | "roundGlasses" | "tinyGlasses" | "shades" | undefined;
type Body = "chest" | "breasts";

type Clothing =
  | "naked"
  | "shirt"
  | "dressShirt"
  | "vneck"
  | "tankTop"
  | "dress";

type ClothingColor = "white" | "blue" | "black" | "green" | "red";
type Eyebrows = "raised" | "leftLowered" | "serious" | "angry" | "concerned";
type Eyes =
  | "normal"
  | "leftTwitch"
  | "happy"
  | "content"
  | "squint"
  | "simple"
  | "dizzy"
  | "wink"
  | "heart";
type FacialHair = "none" | "none2" | "none3" | "stubble" | "mediumBeard";
type Graphic = "none" | "redwood" | "gatsby" | "vue" | "react" | "graphQL";
type Hair =
  | "none"
  | "long"
  | "bun"
  | "short"
  | "pixie"
  | "balding"
  | "buzz"
  | "afro"
  | "bob";
type HairColor =
  | "blonde"
  | "orange"
  | "black"
  | "white"
  | "brown"
  | "blue"
  | "pink";
type Hat = "none" | "none2" | "none3" | "none4" | "none5" | "beanie" | "turban";
type HatColor = "white" | "blue" | "black" | "green" | "red";
type LipColor = "red" | "purple" | "pink" | "turqoise" | "green";
type Mouth =
  | "grin"
  | "sad"
  | "openSmile"
  | "lips"
  | "open"
  | "serious"
  | "tongue";
type SkinTone = "light" | "yellow" | "brown" | "dark" | "red" | "black";

export const UserAvatar = (props: { email: string }) => {
  const [email, setEmail] = useState("");
  const [hash, setHash] = useState<number[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setEmail(props.email);
      setHash([]);
      if (email !== "") {
        email.split("").map((letter) => {
          setHash((hash) => [...hash, letter.charCodeAt(0) % 15]);
        });
      }
    });
  }, [props]);

  const randomAccessory = (n: number): Accessory => {
    const array: Accessory[] = [
      "none",
      "roundGlasses",
      "tinyGlasses",
      "shades",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomBody = (n: number): Body => {
    const array: Body[] = ["chest", "breasts"];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomClothing = (n: number): Clothing => {
    const array: Clothing[] = [
      "naked",
      "shirt",
      "dressShirt",
      "vneck",
      "tankTop",
      "dress",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomClothingColor = (n: number): ClothingColor => {
    const array: ClothingColor[] = ["white", "blue", "black", "green", "red"];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomEyebrows = (n: number): Eyebrows => {
    const array: Eyebrows[] = [
      "raised",
      "leftLowered",
      "serious",
      "angry",
      "concerned",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomEyes = (n: number): Eyes => {
    const array: Eyes[] = [
      "normal",
      "leftTwitch",
      "happy",
      "content",
      "squint",
      "simple",
      "dizzy",
      "wink",
      "heart",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomFacialHair = (n: number): FacialHair => {
    const array: FacialHair[] = [
      "none",
      "none2",
      "none3",
      "stubble",
      "mediumBeard",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomGraphic = (n: number): Graphic => {
    const array: Graphic[] = [
      "none",
      "redwood",
      "gatsby",
      "vue",
      "react",
      "graphQL",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomHair = (n: number): Hair => {
    const array: Hair[] = [
      "none",
      "long",
      "bun",
      "short",
      "pixie",
      "balding",
      "buzz",
      "afro",
      "bob",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomHairColor = (n: number): HairColor => {
    const array: HairColor[] = [
      "blonde",
      "orange",
      "black",
      "white",
      "brown",
      "blue",
      "pink",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomHat = (n: number): Hat => {
    const array: Hat[] = [
      "none",
      "none2",
      "none3",
      "none4",
      "none5",
      "beanie",
      "turban",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomHatColor = (n: number): HatColor => {
    const array: HatColor[] = ["white", "blue", "black", "green", "red"];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomLipColor = (n: number): LipColor => {
    const array: LipColor[] = ["red", "purple", "pink", "turqoise", "green"];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomMouth = (n: number): Mouth => {
    const array: Mouth[] = [
      "grin",
      "sad",
      "openSmile",
      "lips",
      "open",
      "serious",
      "tongue",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  const randomSkinTone = (n: number): SkinTone => {
    const array: SkinTone[] = [
      "light",
      "yellow",
      "brown",
      "dark",
      "red",
      "black",
    ];
    const randomIndex = Math.floor(Math.random() * array.length);
    return n === -1 ? array[randomIndex] : array[n];
  };

  return (
    <BigHead
      accessory={randomAccessory(hash[0]) || "none"}
      body={randomBody(hash[1]) || "chest"}
      circleColor="blue"
      clothing={randomClothing(hash[2]) || "shirt"}
      clothingColor={randomClothingColor(hash[3]) || "blue"}
      eyebrows={randomEyebrows(hash[4]) || "leftLowered"}
      eyes={randomEyes(hash[5]) || "normal"}
      facialHair={randomFacialHair(hash[6]) || "none"}
      graphic={randomGraphic(hash[7]) || "redwood"}
      hair={randomHair(hash[8]) || "short"}
      hairColor={randomHairColor(hash[9]) || "brown"}
      hat={randomHat(hash[10]) || "none"}
      hatColor={randomHatColor(hash[11]) || "blue"}
      lipColor={randomLipColor(hash[12]) || "tongue"}
      mouth={randomMouth(hash[13]) || "open"}
      skinTone={randomSkinTone(hash[14]) || "light"}
    />
  );
};
