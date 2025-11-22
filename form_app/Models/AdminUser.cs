using System.ComponentModel.DataAnnotations;

namespace NameApp.Api.Models
{
    public class AdminUser
    {
        public AdminUser(string Username, string PasswordHash)
        {
            this.Username = Username;
            this.PasswordHash = PasswordHash;
        }
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }
    }
}