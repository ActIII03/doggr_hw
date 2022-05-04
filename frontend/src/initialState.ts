import random from "lodash.random";
import { State, Profile } from "./types/StateTypes";


const initialState: State = {
  currentProfile: getRandomProfile(),
  likeHistory: [getRandomProfile(), getRandomProfile()],
  passHistory: [],
};

export default initialState;

export function getRandomProfile(): Profile {
  const idNum = random(0, 100000000000, false);

  return {
    imgUri: `https://loremflickr.com/300/300/animal?lock=${idNum}`,
    thumbUri: `https://loremflickr.com/75/75/animal?lock=${idNum}`,
    name: `Doggr${idNum}`,
    id: idNum,
  };
}