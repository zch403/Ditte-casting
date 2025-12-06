using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NameApp.Api.Models
{
    
    public class ConditionTarget
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Condition")]
        public int ConditionId { get; set; }
        public Condition? Condition { get; set; }
        [ForeignKey("FormField")]
        public int TargetFieldId { get; set; }
        public FormField? TargetField { get; set; }
    }
}