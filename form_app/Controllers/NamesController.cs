using Microsoft.AspNetCore.Mvc;
using NameApp.Api.Data;
using NameApp.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace NameApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NamesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public NamesController(AppDbContext db) => _db = db;

        // POST: /api/names (anyone can submit)
        [HttpPost]
        public async Task<IActionResult> SubmitName([FromBody] NameEntry entry)
        {
            Console.WriteLine($"Received: {entry?.Name ?? "NULL"}");
            _db.Names.Add(entry);
            await _db.SaveChangesAsync();
            return Ok(entry);
        }
        
        // DELETE: /api/names/{id}
        [HttpDelete("{id}")]
        [Authorize]   // Only admin can delete
        public async Task<IActionResult> DeleteName(int id)
        {
            var entry = await _db.Names.FindAsync(id);
            if (entry == null)
                return NotFound();

            _db.Names.Remove(entry);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // GET: /api/names (superuser only)
        [HttpGet]
        [Authorize]  // requires JWT
        public async Task<IActionResult> GetNames()
        {
            var names = await _db.Names.ToListAsync();
            return Ok(names);
        }
    }
}