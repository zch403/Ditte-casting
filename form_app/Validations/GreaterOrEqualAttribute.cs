using System.ComponentModel.DataAnnotations;
namespace NameApp.Api.Validations
{
    public class GreaterOrEqualAttribute : ValidationAttribute
    {
        private readonly string _otherPropertyName;
        public GreaterOrEqualAttribute(string otherPropertyName)
        {
            _otherPropertyName = otherPropertyName;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var otherProp = validationContext.ObjectType.GetProperty(_otherPropertyName);
            if (otherProp == null)
                return new ValidationResult($"Unknown property: {_otherPropertyName}");

            var otherValue = otherProp.GetValue(validationContext.ObjectInstance);
            if (value is int val && otherValue is int otherVal && val < otherVal)
            {
                return new ValidationResult($"{validationContext.MemberName} must be >= {_otherPropertyName}");
            }
            return ValidationResult.Success;
        }
    }
}