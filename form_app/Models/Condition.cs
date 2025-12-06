using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NameApp.Api.Models
{
    public class Condition
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("FormField")]

        public int TriggerFieldId { get; set; }
        public FormField? TriggerField { get; set; }

        public ConditionOperator Operator { get; set; }   // "equals", "not_equals", "greater", ...
        public string Value { get; set; } = null!;     // compared to TriggerField answer

        public List<ConditionTarget> Targets { get; set; } = new();
    }
}