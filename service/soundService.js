import { Audio } from "expo-av";

const sounds = {
  like: require("../assets/sounds/like.mp3"),
  star: require("../assets/sounds/star.mp3"),
};

let soundObject = null;

export async function playSound(type) {
  try {
    if (soundObject) {
      await soundObject.unloadAsync();
    }

    soundObject = new Audio.Sound();
    await soundObject.loadAsync(sounds[type]);
    await soundObject.playAsync();
  } catch (error) {
    console.log("Error al reproducir sonido:", error);
  }
}