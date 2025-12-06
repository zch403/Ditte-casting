using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NameApp.Api.Models
{
    public class FormField
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Form")]
        public int FormId { get; set; }
        public string Label { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public FieldType Type { get; set; }
        public bool IsRequired { get; set; }
        public List<Condition> ConditionsWhereTrigger { get; set; } = new();
        public int? MinLength { get; set; }
        public int? MaxLength { get; set; }
        public int? MinValue { get; set; }
        public int? MaxValue { get; set; }
        public Form? Form { get; set; }

    }
}