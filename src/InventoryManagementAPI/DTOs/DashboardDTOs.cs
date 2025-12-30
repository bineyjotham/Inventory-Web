// DTOs/DashboardDTOs.cs
using System;
using System.Collections.Generic;

namespace InventoryManagementAPI.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalItems { get; set; }
        public int LowStockItems { get; set; }
        public int OutOfStockItems { get; set; }
        public decimal TotalValue { get; set; }
        public int TodayMovements { get; set; }
        public int PendingApprovals { get; set; }
        public int ActiveSuppliers { get; set; }
        public int ActiveUsers { get; set; }
    }

    public class CategoryDistributionDto
    {
        public string Category { get; set; }
        public int ItemCount { get; set; }
        public decimal TotalValue { get; set; }
        public decimal Percentage { get; set; }
    }

    public class RecentActivityDto
    {
        public string Type { get; set; }
        public string ItemName { get; set; }
        public string UserName { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public string Reference { get; set; }
    }

    public class StockAlertDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string SKU { get; set; }
        public int CurrentQuantity { get; set; }
        public int LowStockThreshold { get; set; }
        public string Status { get; set; }
        public DateTime LastRestocked { get; set; }
    }
}