using System.ComponentModel.DataAnnotations;

namespace NameApp.Api.Models
{
    public class NameEntry
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}