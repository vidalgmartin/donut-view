using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Database;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class Models3dController : ControllerBase
    {
        private readonly ServerDbContext _db;

        public Models3dController(ServerDbContext db) 
        {
            _db = db; 
        }

        [HttpPost]
        public async Task<IActionResult> UploadModel([FromForm] Model3dUploadDto modelDto)
        {
            if (modelDto.File == null || modelDto.File.Length == 0)
            {
                return BadRequest("No file was uploaded");
            }

            var extension = Path.GetExtension(modelDto.File.FileName).ToLowerInvariant();
            if (extension != ".glb")
            {
                return BadRequest("Only .glb files are allowed.");
            }

            using var memoryStream = new MemoryStream();
            await modelDto.File.CopyToAsync(memoryStream);

            // Logged in user id
            var userId = int.Parse(User.FindFirst("id")?.Value!);

            var model = new Model3D
            {
                UserId = userId,
                Name = modelDto.Name,
                Description = modelDto.Description,
                FileData = memoryStream.ToArray()
            };

            _db.Models3D.Add(model);
            await _db.SaveChangesAsync();

            return Ok(model);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllModels()
        {
            var models = await _db.Models3D.ToListAsync();

            return Ok(models);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetModelsPerUser()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value!);

            var models = await _db.Models3D
                .Where(m => m.UserId == userId)
                .ToListAsync();

            return Ok(models);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetModelFile(int id)
        {
            var model = await _db.Models3D.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            return File(model.FileData, "model/gltf-binary", $"{model.Name}.glb");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModel(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value!);

            var model = await _db.Models3D.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);
            if (model == null)
                return NotFound();

            _db.Models3D.Remove(model);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
