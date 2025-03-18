using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Interfaces
{
    internal interface ISongRepository
    {
        public interface IPlayListService
        {
            List<PlayListDto> GetList();         // מחזיר את כל רשימת הפלייליסטים ב-DTO
            PlayListDto GetById(int id);         // מחזיר פלייליסט לפי מזהה כ-DTO
            public PlayListDto AddPlayList(PlayListDto playListDto);


            bool Update(int id, PlayListDto playListDto);  // מעדכן פלייליסט קיים ב-DTO
            bool Remove(int id);  // מסיר פלייליסט לפי מזהה
        }
    }
}
