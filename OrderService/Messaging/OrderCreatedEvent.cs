namespace OrderService.Messaging
{
    public class OrderCreatedEvent
    {
        public int OrderId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ItemCount { get; set; }
    }
}
