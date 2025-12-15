using MassTransit;

namespace OrderService.Messaging
{
    public class OrderCreatedConsumer : IConsumer<OrderCreatedEvent>
    {
        private readonly ILogger<OrderCreatedConsumer> _logger;

        public OrderCreatedConsumer(ILogger<OrderCreatedConsumer> logger)
        {
            _logger = logger;
        }

        public Task Consume(ConsumeContext<OrderCreatedEvent> context)
        {
            var message = context.Message;
            _logger.LogInformation(
                "Order Created: OrderId={OrderId}, UserId={UserId}, TotalAmount={TotalAmount}, ItemCount={ItemCount}",
                message.OrderId, message.UserId, message.TotalAmount, message.ItemCount);

            return Task.CompletedTask;
        }
    }
}
