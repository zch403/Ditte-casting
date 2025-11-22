using System.ComponentModel.DataAnnotations;

namespace NameApp.Api.Models
{
    public class NameEntry
    {
        public NameEntry(string Name)
        {
            this.Name = Name;
        }
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}