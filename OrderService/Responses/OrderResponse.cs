using OrderService.Models;

namespace OrderService.Responses
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemResponse> OrderItems { get; set; } = new();
    }
}
