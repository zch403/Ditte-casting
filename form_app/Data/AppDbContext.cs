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
        public DbSet<Condition> Conditions => Set<Condition>();
        public DbSet<ConditionTarget> ConditionTargets => Set<ConditionTarget>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure enum to string conversion for FieldType
            modelBuilder.Entity<FormField>()
                .Property(f => f.Type)
                .HasConversion<string>();
            
            // Configure enum to string conversion for ConditionOperator
            modelBuilder.Entity<Condition>()
                .Property(f => f.Operator)
                .HasConversion<string>();
            
            // Form → FormField (cascade)
            modelBuilder.Entity<FormField>()
                .HasOne(f => f.Form)
                .WithMany(f => f.Fields)
                .HasForeignKey(f => f.FormId)
                .OnDelete(DeleteBehavior.Cascade);

            // FormField → Condition (cascade)
            modelBuilder.Entity<Condition>()
                .HasOne(c => c.TriggerField)
                .WithMany(f => f.ConditionsWhereTrigger)
                .HasForeignKey(c => c.TriggerFieldId)
                .OnDelete(DeleteBehavior.Cascade);

            // Condition → ConditionTarget (cascade)
            modelBuilder.Entity<ConditionTarget>()
                .HasOne(ct => ct.Condition)
                .WithMany(c => c.Targets)
                .HasForeignKey(ct => ct.ConditionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}