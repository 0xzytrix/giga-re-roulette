import axios from "axios";
import type { IPlayer } from "../types";

export const fetchXUserProfile = async (username: string): Promise<IPlayer> => {
  const cleanUser = username.replace("@", "").trim();

  try {
    const response = await axios.get(`/api/getUser?username=${cleanUser}`);
    return {
      ...response.data,
      isEliminated: false,
    };
  } catch (error) {
    console.error(error);
    throw new Error("User not found or API blocked");
  }
};
