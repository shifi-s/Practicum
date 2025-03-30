export class Song {
    constructor(
        public id: number,
       public title: string,
        public artist: string,
        public audioUrl: string,
        public tags:string="",
       public  genre?: string, // ניתן להחליף לאובייקט אם יש פרטים נוספים
        public ratings?: number[],
    )
    { 
        tags=title+','+artist+','+genre
    }// מערך דירוגים (אפשר להחליף לאובייקט אם יש יותר פרטים)
}
