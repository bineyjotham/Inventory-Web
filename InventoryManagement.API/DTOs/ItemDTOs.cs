// DTOs/ItemDTOs.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace InventoryManagementAPI.DTOs
{
    public class ItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SKU { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
        public int LowStockThreshold { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalValue => Quantity * UnitPrice;
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? LastRestocked { get; set; }
    }

    public class CreateItemDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string SKU { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int LowStockThreshold { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        [Required]
        public int SupplierId { get; set; }

        [StringLength(100)]
        public string Location { get; set; }
    }

    public class UpdateItemDto
    {
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public int? CategoryId { get; set; }

        [Range(0, int.MaxValue)]
        public int? Quantity { get; set; }

        [Range(1, int.MaxValue)]
        public int? LowStockThreshold { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? UnitPrice { get; set; }

        public int? SupplierId { get; set; }

        [StringLength(100)]
        public string Location { get; set; }
    }

    public class ItemQueryParams
    {
        public string Search { get; set; }
        public string Category { get; set; }
        public string Status { get; set; }
        public string SortBy { get; set; } = "name";
        public bool SortDescending { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}