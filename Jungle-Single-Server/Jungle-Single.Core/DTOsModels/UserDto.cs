using Jungle_Single.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.DtosModels
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public List<Playlist>? Playlists { get; set; } // פלייליסטים של המשתמש

        public Roles Role { get; set; }
    }
}
