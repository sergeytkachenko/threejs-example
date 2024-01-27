import {AbstractPlanet, Planet} from "@/planet/abstract-planet";
import {Color} from "three";

export class Earth extends AbstractPlanet {

    protected getSlowMo(): number {
        return 0.05;
    }

    protected getColor(): Color {
        return new Color("rgb(25,79,161)");
    }
}
