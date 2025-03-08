import ValorantLogo from "./src/assets/images/valorant-logo-icon.png";
import LeagueLogo from "./src/assets/images/LoL_icon.png";
import Overwatch2Logo from "./src/assets/images/Overwatch_2_logo.png";
import MarvelRivalsLogo from "./src/assets/images/marvel_rivals.png";

export interface Game {
    name: string;
    application: string;
    color: string;
    icon: string;
}

const games: Game[] = [
    {
        name: "Valorant",
        application: "VALORANT-Win64-Shipping.exe",
        color: "#FF0000",
        icon: ValorantLogo
    },
    {
        name: "League Of Legends",
        application: "League Of Legends.exe",
        color: "#1688FF",
        icon: LeagueLogo
    },
    {
        name: "(Client) League Of Legends",
        application: "LeagueClient.exe",
        color: "#1688FF",
        icon: LeagueLogo
    },
    {
        name: "Overwatch",
        application: "Overwatch.exe",
        color: "#DF550F",
        icon: Overwatch2Logo
    },
    {
        name: "Marvel Rivals",
        application: "Marvel-Win64-Shipping.exe",
        color: "#9BC063",
        icon: MarvelRivalsLogo
    }
];

export default games;
