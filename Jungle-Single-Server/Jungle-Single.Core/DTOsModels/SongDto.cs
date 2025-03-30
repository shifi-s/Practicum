using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.DTOsModels
{
    public class SongDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Artist { get; set; } = string.Empty;

        public string  Genre { get; set; } = string.Empty;


        [Required]
        public string AudioUrl  { get; set; }= string.Empty;
    }
}
