using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Models
{
    public class SongsPlalists
    {
        public int PlaylistId { get; set; }
        public Playlist Playlist { get; set; }

        public int SongId { get; set; }
        public Song Song { get; set; }
    }
}
