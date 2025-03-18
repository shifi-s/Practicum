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
        public int GenreId { get; set; } // קישור לז'אנר
        public Genre? Genre { get; set; }
        public string Url { get; set; } = string.Empty; // קישור לקובץ השיר
        public List<Rating>? Ratings { get; set; } // דירוגים
    }
}
