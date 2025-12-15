using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Messaging;
using OrderService.Models;
using OrderService.Requests;
using OrderService.Responses;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrderDbContext _context;
        private readonly ILogger<OrdersController> _logger;
        private readonly IPublishEndpoint _publishEndpoint;

        public OrdersController(OrderDbContext context, ILogger<OrdersController> logger, IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _logger = logger;
            _publishEndpoint = publishEndpoint;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponse>>> GetOrders()
        {
            _logger.LogInformation("Getting all orders");
            var orders = await _context.Orders.Include(o => o.OrderItems).ToListAsync();
            var orderResponses = orders.Select(order => new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponse
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            }).ToList();

            return orderResponses;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponse>> GetOrder(int id)
        {
            _logger.LogInformation("Getting order with id: {Id}", id);
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                _logger.LogWarning("Order with id: {Id} not found", id);
                return NotFound();
            }

            var orderDto = new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponse
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            };

            return orderDto;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderResponse>>> GetOrdersByUser(string userId)
        {
            _logger.LogInformation("Getting orders for user: {UserId}", userId);
            var orders = await _context.Orders.Where(o => o.UserId == userId).Include(o => o.OrderItems).ToListAsync();
            var orderResponses = orders.Select(order => new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponse
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            }).ToList();

            return orderResponses;
        }

        [HttpPost]
        public async Task<ActionResult<OrderResponse>> CreateOrder(OrderRequest orderRequest)
        {
            _logger.LogInformation("Creating new order for user: {UserId}", orderRequest.UserId);

            var order = new Order
            {
                UserId = orderRequest.UserId,
                CreatedAt = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                OrderItems = orderRequest.OrderItems.Select(oi => new OrderItem
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            };

            // Calculate total amount
            order.TotalAmount = orderRequest.OrderItems.Sum(oi => oi.Quantity * oi.UnitPrice);
            order.CreatedAt = DateTime.UtcNow;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Publish event to RabbitMQ
            var orderCreatedEvent = new OrderCreatedEvent
            {
                OrderId = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                ItemCount = order.OrderItems.Count
            };

            await _publishEndpoint.Publish(orderCreatedEvent);
            _logger.LogInformation("Published OrderCreatedEvent for order: {OrderId}", order.Id);

            var orderResponse = new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponse
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderResponse);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateOrder(int id, Order order)
        //{
        //    if (id != order.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _logger.LogInformation("Updating order with id: {Id}", id);
        //    _context.Entry(order).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!OrderExists(id))
        //        {
        //            return NotFound();
        //        }
        //        throw;
        //    }

        //    return NoContent();
        //}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            _logger.LogInformation("Deleting order with id: {Id}", id);
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
