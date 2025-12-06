using System.ComponentModel.DataAnnotations;
using NameApp.Api.Models;
namespace NameApp.Api.DTOs
{
    public class ConditionDTO : IValidatableObject
    {
        [Required]
        // [EnumDataType(typeof(Models.ConditionOperator))]
        public string Operator { get; set; } = null!;
        [Required]
        public string Value { get; set; } = null!;
        [Required]
        public List<ConditionTargetDTO> Targets { get; set; } = null!;
        public IEnumerable<ValidationResult> Validate(ValidationContext context)
        {
            var typeLower = Operator?.ToLower();
            if (ConditionOperatorHelper.FromString(typeLower!) == null) {
                yield return new ValidationResult(
                    "Type can only be valid FieldType",
                    new[] { nameof(typeLower) });
            }
        }
    }
}