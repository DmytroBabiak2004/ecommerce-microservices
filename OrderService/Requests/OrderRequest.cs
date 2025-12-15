namespace OrderService.Requests
{
    public class OrderRequest
    {
        public string UserId { get; set; } = string.Empty;
        public List<OrderItemRequest> OrderItems { get; set; } = new();
    }
}
