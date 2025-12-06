using System.ComponentModel.DataAnnotations;
namespace NameApp.Api.DTOs
{
    public class FormDTO: IValidatableObject
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = null!;
        [Required]
        public List<FormFieldDTO> Fields { get; set; } = null!;
        public bool IsActive { get; set; } = false;
        public IEnumerable<ValidationResult> Validate(ValidationContext context)
        {
            for (int i = 0; i < Fields.Count; i++)
            {
                var field = Fields[i];
                foreach (var condition in field.ConditionsWhereTrigger)
                {
                    foreach (var target in condition.Targets)
                    {
                        if (target.FieldOrderIndex < 0 || target.FieldOrderIndex >= Fields.Count)
                        {
                            yield return new ValidationResult(
                                $"Condition target index {target.FieldOrderIndex} is invalid.",
                                new[] { $"Fields[{i}].ConditionsWhereTrigger.Targets" });
                        }
                        if (target.FieldOrderIndex <= i)
                        {
                            yield return new ValidationResult(
                                $"Condition target index {target.FieldOrderIndex} is trying to hide a field that comes before in this field.",
                                new[] { $"Fields[{i}].ConditionsWhereTrigger.Targets" });
                        }
                    }
                }
            }
            yield break;
        }
    }
}