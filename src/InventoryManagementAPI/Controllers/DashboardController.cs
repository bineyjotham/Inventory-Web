// Controllers/DashboardController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagementAPI.Data;
using InventoryManagementAPI.DTOs;

namespace InventoryManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var today = DateTime.UtcNow.Date;

            var stats = new DashboardStatsDto
            {
                TotalItems = await _context.Items.CountAsync(i => i.Status != "deleted"),
                LowStockItems = await _context.Items.CountAsync(i => i.Status == "low-stock"),
                OutOfStockItems = await _context.Items.CountAsync(i => i.Status == "out-of-stock"),
                TotalValue = await _context.Items
                    .Where(i => i.Status != "deleted")
                    .SumAsync(i => i.Quantity * i.UnitPrice),
                TodayMovements = await _context.InventoryMovements
                    .CountAsync(m => m.MovementDate.Date == today),
                ActiveSuppliers = await _context.Suppliers.CountAsync(s => s.Status == "active"),
                ActiveUsers = await _context.Users.CountAsync(u => u.IsActive)
            };

            // Add pending approvals for admin
            if (User.IsInRole("admin"))
            {
                stats.PendingApprovals = 5; // This would come from an approvals table
            }

            return Ok(stats);
        }

        [HttpGet("category-distribution")]
        public async Task<IActionResult> GetCategoryDistribution()
        {
            var distribution = await _context.Categories
                .Include(c => c.Items)
                .Select(c => new CategoryDistributionDto
                {
                    Category = c.Name,
                    ItemCount = c.Items.Count,
                    TotalValue = c.Items.Sum(i => i.Quantity * i.UnitPrice)
                })
                .Where(d => d.ItemCount > 0)
                .ToListAsync();

            var totalValue = distribution.Sum(d => d.TotalValue);

            foreach (var item in distribution)
            {
                item.Percentage = totalValue > 0 ? (item.TotalValue / totalValue) * 100 : 0;
            }

            return Ok(distribution);
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
        {
            var activities = await _context.InventoryMovements
                .Include(m => m.Item)
                .Include(m => m.User)
                .OrderByDescending(m => m.MovementDate)
                .Take(limit)
                .Select(m => new RecentActivityDto
                {
                    Type = m.Type,
                    ItemName = m.Item.Name,
                    UserName = m.User.Name,
                    Quantity = m.Quantity,
                    Date = m.MovementDate,
                    Reference = m.Reference
                })
                .ToListAsync();

            return Ok(activities);
        }

        [HttpGet("low-stock-alerts")]
        public async Task<IActionResult> GetLowStockAlerts()
        {
            var alerts = await _context.Items
                .Where(i => i.Quantity <= i.LowStockThreshold && i.Status != "out-of-stock")
                .OrderBy(i => i.Quantity)
                .Take(10)
                .Select(i => new StockAlertDto
                {
                    ItemId = i.Id,
                    ItemName = i.Name,
                    SKU = i.SKU,
                    CurrentQuantity = i.Quantity,
                    LowStockThreshold = i.LowStockThreshold,
                    Status = i.Status,
                    LastRestocked = i.LastRestocked ?? i.CreatedAt
                })
                .ToListAsync();

            return Ok(alerts);
        }

        [HttpGet("monthly-movements")]
        public async Task<IActionResult> GetMonthlyMovements([FromQuery] int months = 6)
        {
            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddMonths(-months);

            var monthlyMovements = await _context.InventoryMovements
                .Where(m => m.MovementDate >= startDate && m.MovementDate <= endDate)
                .GroupBy(m => new { Year = m.MovementDate.Year, Month = m.MovementDate.Month })
                .Select(g => new
                {
                    Period = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Inbound = g.Where(m => m.Type == "inbound").Sum(m => m.Quantity),
                    Outbound = g.Where(m => m.Type == "outbound").Sum(m => Math.Abs(m.Quantity)),
                    Adjustments = g.Where(m => m.Type == "adjustment").Count()
                })
                .OrderBy(g => g.Period)
                .ToListAsync();

            return Ok(monthlyMovements);
        }
    }
}