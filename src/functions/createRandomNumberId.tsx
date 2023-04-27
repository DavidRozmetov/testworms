export const createRandomNumberId = (lengthOfPassword: number) => {
  let randomNumberId = "";

  while (randomNumberId.length < lengthOfPassword) {
    randomNumberId = randomNumberId + Math.floor(Math.random() * 10);
  }
  return randomNumberId;
};

export const createARandomIdWithInitial = (
  initial: string,
  idLength: number
) => {
  return initial + createRandomNumberId(idLength);
};
