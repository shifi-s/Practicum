﻿using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Jungle_Single.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Song : ControllerBase
    {
        // GET: api/<Song>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<Song>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<Song>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<Song>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Song>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
