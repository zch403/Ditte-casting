using System.ComponentModel.DataAnnotations;
namespace NameApp.Api.DTOs
{
    public class ConditionTargetDTO
    {
        [Required]
        public int FieldOrderIndex { get; set; }
    }
}