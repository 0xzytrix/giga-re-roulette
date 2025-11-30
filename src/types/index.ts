export interface IPlayer {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isEliminated: boolean;
}

export interface IRouletteItem {
  image?: string;
  text?: string;
  id: string;
  htmlContent?: string;
  style?: { backgroundColor?: string; textColor?: string };
}
