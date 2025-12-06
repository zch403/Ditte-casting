using Microsoft.AspNetCore.Mvc;
using NameApp.Api.Data;
using NameApp.Api.Models;
using NameApp.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace NameApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public FormsController(AppDbContext db) => _db = db;

        // POST: /api/forms (anyone can submit)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateForm([FromBody] FormDTO dto)
        {
            if (dto == null)
                return BadRequest("Entry cannot be null.");
            // Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(dto));
            // Create the form and fields, but don't set ConditionTargets yet
            var form = new Form
            {
                Title = dto.Title,
                Fields = dto.Fields.Select((f, i) => new FormField
                {
                    Label = f.Label,
                    Type = FormFieldTypeHelper.FromString(f.Type)!.Value,
                    IsRequired = f.IsRequired,
                    OrderIndex = i,
                    MinLength = f.MinLength,
                    MaxLength = f.MaxLength,
                    MinValue = f.MinValue,
                    MaxValue = f.MaxValue
                }).ToList()
            };

            _db.Forms.Add(form);
            await _db.SaveChangesAsync(); // now IDs are generated

            // Now map ConditionTargets using the saved IDs
            foreach (var (fieldDto, index) in dto.Fields.Select((value, i) => (value, i)))
            {
                var field = form.Fields.First(f => f.OrderIndex == index);

                field.ConditionsWhereTrigger = fieldDto.ConditionsWhereTrigger.Select(c => new Condition
                {
                    Operator = ConditionOperatorHelper.FromString(c.Operator)!.Value,
                    Value = c.Value,
                    Targets = c.Targets.Select(t =>
                    {
                        var targetField = form.Fields.First(f => f.OrderIndex == t.FieldOrderIndex);
                        return new ConditionTarget
                        {
                            TargetFieldId = targetField.Id
                        };
                    }).ToList()
                }).ToList();
            }

            await _db.SaveChangesAsync(); // save the targets
            return Ok();
        }
        
        // DELETE: /api/forms/{id}
        [HttpDelete("{id}")]
        [Authorize]   
        public async Task<IActionResult> DeleteForm(int id)
        {
            var form = await _db.Forms.FindAsync(id);

            if (form == null)
                return NotFound();
            if (form.IsActive)
                return Conflict("Cannot delete an active form.");
            _db.Forms.Remove(form);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // GET: /api/forms/{id}
        [HttpGet("{id}")]
        [Authorize] 
        public async Task<IActionResult> GetForm(int id)
        {
            var form = await _db.Forms
                .Include(f => f.Fields)
                .ThenInclude(field => field.ConditionsWhereTrigger) // include conditions if needed
                .ThenInclude(c => c.Targets) // include targets
                .FirstOrDefaultAsync(f => f.Id == id);

            if (form == null)
                return NotFound();

            var formDTO = FromForm(form);

            return Ok(formDTO);
        }

        // GET: /api/forms
        [HttpGet]
        [Authorize] 
        public async Task<IActionResult> GetForms()
        {
            var forms = await _db.Forms
                .Include(f => f.Fields)
                .ThenInclude(field => field.ConditionsWhereTrigger) // include conditions if needed
                .ThenInclude(c => c.Targets)
                .ToListAsync();
            var formDTOs = forms.Select(FromForm).ToList();
            return Ok(formDTOs);
        }

        // GET: /api/forms/active
        [HttpGet("active")]
        public async Task<IActionResult> GetFormsActive()
        {
            var forms = await _db.Forms
                .Include(f => f.Fields)
                .ThenInclude(field => field.ConditionsWhereTrigger) // include conditions if needed
                .ThenInclude(c => c.Targets)
                .Where(f => f.IsActive)
                .ToListAsync();
            var formDTOs = forms.Select(FromForm).ToList();
            return Ok(formDTOs);
        }

        private static FormDTO FromForm(Form form)
        {
            return new FormDTO
            {
                Id = form.Id,
                Title = form.Title,
                Fields = form.Fields.Select(f => new FormFieldDTO
                {
                    Label = f.Label,
                    Type = f.Type.ToString(),
                    IsRequired = f.IsRequired,
                    MinLength = f.MinLength,
                    MaxLength = f.MaxLength,
                    MinValue = f.MinValue,
                    MaxValue = f.MaxValue,
                    ConditionsWhereTrigger = f.ConditionsWhereTrigger.Select(c => new ConditionDTO
                    {
                        Operator = c.Operator.ToString(),
                        Value = c.Value,
                        Targets = c.Targets.Select(t => new ConditionTargetDTO
                        {
                            FieldOrderIndex = form.Fields.First(fld => fld.Id == t.TargetFieldId).OrderIndex
                        }).ToList()
                    }).ToList()
                }).ToList(),
                IsActive = form.IsActive
            };
        }
    }
}