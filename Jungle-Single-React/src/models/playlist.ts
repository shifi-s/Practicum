import { Song } from "./Song";

export interface Playlist {
    id: string;
    name: string;
    userId: string; // ניתן להחליף לאובייקט אם יש פרטים נוספים
    songs:Song[]
}