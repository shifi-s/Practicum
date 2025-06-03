using Jungle_Single.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string? Genre { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string Tags { get; set; } = "";
        public DateTime UploadDate { get; set; }
        public bool IsDeleted { get; set; }=false;
        public string? CoverUrl { get; set; }= string.Empty;    
        //public List<SongsPlalists> Playlists=[];
        public List<Rating>? Ratings { get; set; } // דירוגים
        public List<SongsPlalists> PlaylistSongs { get; set; } = [];
        public string Lyrics = "";
    }
}
