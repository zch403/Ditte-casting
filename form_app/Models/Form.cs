using System.ComponentModel.DataAnnotations;
namespace NameApp.Api.Models
{
    public class Form
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<FormField> Fields { get; set; } = new List<FormField>();

    }
}