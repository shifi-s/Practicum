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
        public string Tags { get; set; } = ""; // קישור לקובץ השיר
        public List<Rating>? Ratings { get; set; } // דירוגים
    }
}
