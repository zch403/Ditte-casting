using Microsoft.EntityFrameworkCore;
using NameApp.Api.Models;

namespace NameApp.Api.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<NameEntry> Names { get; set; }
        public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
        public DbSet<Form> Forms => Set<Form>();
        public DbSet<FormField> FormFields => Set<FormField>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure enum to string conversion for FieldType
            modelBuilder.Entity<FormField>()
                .Property(f => f.Type)
                .HasConversion<string>();
        }
    }
}