// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using InventoryManagementAPI.Models;

namespace InventoryManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<InventoryMovement> InventoryMovements { get; set; }
        public DbSet<Report> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Item>()
                .HasOne(i => i.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Supplier)
                .WithMany(s => s.Items)
                .HasForeignKey(i => i.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<InventoryMovement>()
                .HasOne(m => m.Item)
                .WithMany(i => i.Movements)
                .HasForeignKey(m => m.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<InventoryMovement>()
                .HasOne(m => m.User)
                .WithMany(u => u.Movements)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reports)
                .HasForeignKey(r => r.GeneratedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Item>()
                .HasIndex(i => i.SKU)
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Name)
                .IsUnique();

            modelBuilder.Entity<Supplier>()
                .HasIndex(s => s.Email)
                .IsUnique();

            modelBuilder.Entity<InventoryMovement>()
                .HasIndex(m => m.Reference)
                .IsUnique();

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed default admin user
            var adminUser = new User
            {
                Id = 1,
                Name = "Admin User",
                Email = "admin@inventory.com",
                Role = "admin",
                Avatar = "AU",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Create password hash for "admin123"
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            adminUser.PasswordSalt = hmac.Key;
            adminUser.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("admin123"));

            modelBuilder.Entity<User>().HasData(adminUser);

            // Seed default categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Electronics", Description = "Electronic items and components", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 2, Name = "Office Supplies", Description = "Office stationery and supplies", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 3, Name = "Furniture", Description = "Office furniture and equipment", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 4, Name = "Raw Materials", Description = "Raw materials for production", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Seed default suppliers
            modelBuilder.Entity<Supplier>().HasData(
                new Supplier { Id = 1, Name = "TechParts Inc.", ContactPerson = "John Smith", Email = "john@techparts.com", Phone = "+1 (555) 123-4567", Status = "active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Supplier { Id = 2, Name = "Office Supply Co.", ContactPerson = "Sarah Johnson", Email = "sarah@officesupply.com", Phone = "+1 (555) 987-6543", Status = "active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );
        }
    }
}