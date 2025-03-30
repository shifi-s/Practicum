using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Models
{
    public class SongTags
    {
        [Key]
        public Guid SongId { get; set; }
        public Song Song { get; set; }

        [Key]
        public Guid TagId { get; set; }
        public Tags Tag { get; set; }

    }
}
