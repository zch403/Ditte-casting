using System.ComponentModel.DataAnnotations;
using NameApp.Api.Models;
using NameApp.Api.Validations;
namespace NameApp.Api.DTOs
{
    public class FormFieldDTO : IValidatableObject
    {
        [Required]
        public string Label { get; set; } = null!;
        [Required]
        public string Type { get; set; } = null!;
        [Required]
        public bool IsRequired { get; set; }

        [Required]
        public List<ConditionDTO> ConditionsWhereTrigger { get; set; } = null!;
        [Range(0, int.MaxValue)]
        public int? MinLength { get; set; }
        [Range(0, int.MaxValue)]
        [GreaterOrEqual("MinLength")]
        public int? MaxLength { get; set; }
        public int? MinValue { get; set; }
        [GreaterOrEqual("MinValue")]
        public int? MaxValue { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext context)
        {
            var typeLower = Type?.ToLower();
            bool isString = typeLower == "text";
            bool isNumber = typeLower == "number";
            if (FormFieldTypeHelper.FromString(typeLower!) == null) {
                yield return new ValidationResult(
                    "Type can only be valid FieldType",
                    new[] { nameof(typeLower) });
            }
            if (MinLength.HasValue && !isString)
            {
                yield return new ValidationResult(
                    "MinLength is only a valid constraint for fields of type 'string'.",
                    new[] { nameof(MinLength) });
            }
            if (MaxLength.HasValue && !isString)
            {
                yield return new ValidationResult(
                    "MaxLength is only a valid constraint for fields of type 'string'.",
                    new[] { nameof(MaxLength) });
            }
            if (MinValue.HasValue && !isNumber)
            {
                yield return new ValidationResult(
                    "MinValue is only a valid constraint for fields of type 'number'.",
                    new[] { nameof(MinValue) });
            }
            if (MaxValue.HasValue && !isNumber)
            {
                yield return new ValidationResult(
                    "MaxValue is only a valid constraint for fields of type 'number'.",
                    new[] { nameof(MaxValue) });
            }
            yield break;
        }
    }
}