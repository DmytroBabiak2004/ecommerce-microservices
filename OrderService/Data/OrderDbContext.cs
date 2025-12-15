using Microsoft.EntityFrameworkCore;
using OrderService.Models;

namespace OrderService.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasPrecision(18,2);
                entity.HasMany(e => e.OrderItems)
                      .WithOne(oi => oi.Order)
                      .HasForeignKey(oi => oi.OrderId);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ProductName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            });
        }

        public static async Task SeedData(OrderDbContext context)
        {
            if (!context.Orders.Any())
            {
                var orders = new List<Order>
            {
                new Order
                {
                    UserId = "94518a8e-3712-4658-afbe-a6a8bb20a061",
                    TotalAmount = 1199.98m,
                    Status = OrderStatus.Delivered,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    OrderItems = new List<OrderItem>
                    {
                        new OrderItem { ProductId = 1, ProductName = "Laptop", Quantity = 1, UnitPrice = 999.99m },
                        new OrderItem { ProductId = 3, ProductName = "Headphones", Quantity = 1, UnitPrice = 199.99m }
                    }
                },
                new Order
                {
                    UserId = "94518a8e-3712-4658-afbe-a6a8bb20a061",
                    TotalAmount = 69.98m,
                    Status = OrderStatus.Shipped,
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    OrderItems = new List<OrderItem>
                    {
                        new OrderItem { ProductId = 4, ProductName = "T-Shirt", Quantity = 2, UnitPrice = 19.99m },
                        new OrderItem { ProductId = 5, ProductName = "Jeans", Quantity = 1, UnitPrice = 49.99m }
                    }
                },
                new Order
                {
                    UserId = "94518a8e-3712-4658-afbe-a6a8bb20a061",
                    TotalAmount = 699.99m,
                    Status = OrderStatus.Processing,
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    OrderItems = new List<OrderItem>
                    {
                        new OrderItem { ProductId = 2, ProductName = "Smartphone", Quantity = 1, UnitPrice = 699.99m }
                    }
                }
                };

                context.Orders.AddRange(orders);
                await context.SaveChangesAsync();
            }
        }
    }
}