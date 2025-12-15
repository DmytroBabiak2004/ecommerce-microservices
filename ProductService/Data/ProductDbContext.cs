using Microsoft.EntityFrameworkCore;
using ProductService.Models;

namespace ProductService.Data
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Price).HasPrecision(18,2);
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(e => e.CategoryId);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
            });
        }

        public static async Task SeedData(ProductDbContext context)
        {
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
            {
                new Category { Name = "Electronics", Description = "Electronic devices and gadgets" },
                new Category { Name = "Clothing", Description = "Apparel and fashion items" },
                new Category { Name = "Books", Description = "Books and literature" },
                new Category { Name = "Home & Garden", Description = "Home improvement and garden supplies" }
            };

                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new Product { Name = "Laptop", Description = "High-performance laptop", Price = 999.99m, Stock = 50, CategoryId = 1 },
                    new Product { Name = "Smartphone", Description = "Latest smartphone model", Price = 699.99m, Stock = 100, CategoryId = 1 },
                    new Product { Name = "Headphones", Description = "Wireless noise-cancelling headphones", Price = 199.99m, Stock = 75, CategoryId = 1 },
                    new Product { Name = "T-Shirt", Description = "Cotton t-shirt", Price = 19.99m, Stock = 200, CategoryId = 2 },
                    new Product { Name = "Jeans", Description = "Blue denim jeans", Price = 49.99m, Stock = 150, CategoryId = 2 },
                    new Product { Name = "Sneakers", Description = "Running sneakers", Price = 79.99m, Stock = 80, CategoryId = 2 },
                    new Product { Name = "Programming Book", Description = "Learn C# Programming", Price = 39.99m, Stock = 60, CategoryId = 3 },
                    new Product { Name = "Novel", Description = "Bestselling fiction novel", Price = 14.99m, Stock = 120, CategoryId = 3 },
                    new Product { Name = "Garden Tools Set", Description = "Complete garden tools set", Price = 89.99m, Stock = 40, CategoryId = 4 },
                    new Product { Name = "LED Light Bulbs", Description = "Energy-efficient LED bulbs pack", Price = 24.99m, Stock = 200, CategoryId = 4 }
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }
        }
    }
}
