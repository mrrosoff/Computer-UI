import ValorantLogo from "./src/assets/images/valorant-logo-icon.png";
import LeagueLogo from "./src/assets/images/league.png";
import Overwatch2Logo from "./src/assets/images/Overwatch_2_logo.png";
import MarvelRivalsLogo from "./src/assets/images/marvel_rivals.png";
import LethalCompanyLogo from "./src/assets/images/Lethal_Company.webp";
import Fortnite from "./src/assets/images/fortnite.png";

export interface Game {
    name?: string;
    type?: string;
    application: string;
    primaryColor: string;
    secondaryColor?: string;
    icon: string;
}

const games: Game[] = [
    {
        name: "Valorant",
        application: "VALORANT-Win64-Shipping.exe",
        primaryColor: "#FF0000",
        icon: ValorantLogo
    },
    {
        application: "League Of Legends.exe",
        primaryColor: "#C89B3C",
        secondaryColor: "#1688FF",
        icon: LeagueLogo
    },
    {
        application: "LeagueClient.exe",
        type: "client",
        primaryColor: "#C89B3C",
        secondaryColor: "#1688FF",
        icon: LeagueLogo
    },
    {
        name: "Overwatch",
        application: "Overwatch.exe",
        primaryColor: "#F56600",
        secondaryColor: "#FFFFFF",
        icon: Overwatch2Logo
    },
    {
        name: "Marvel Rivals",
        application: "Marvel-Win64-Shipping.exe",
        primaryColor: "#70964B",
        secondaryColor: "#5C2062",
        icon: MarvelRivalsLogo
    },
    {
        application: "Lethal Company.exe",
        primaryColor: "#FF1500",
        icon: LethalCompanyLogo
    },
    {
        application: "FortniteClient-Win64-Shipping.exe",
        primaryColor: "#BF7070",
        secondaryColor: "#004000",
        icon: Fortnite
    }
];

export default games;
