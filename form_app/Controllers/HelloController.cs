using Microsoft.AspNetCore.Mvc;

namespace form_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet("{name}")]
        public IActionResult SayHello(string name)
        {
            return Ok(new { message = $"Hello, {name}!" });
        }
    }
}