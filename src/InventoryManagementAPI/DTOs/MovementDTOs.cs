// DTOs/MovementDTOs.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace InventoryManagementAPI.DTOs
{
    public class InventoryMovementDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string Type { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Reference { get; set; }
        public string Notes { get; set; }
        public DateTime MovementDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMovementDto
    {
        [Required]
        public int ItemId { get; set; }

        [Required]
        [StringLength(20)]
        public string Type { get; set; } // "inbound", "outbound", "adjustment"

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }
    }

    public class MovementQueryParams
    {
        public string Search { get; set; }
        public string Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string SortBy { get; set; } = "movementdate";
        public bool SortDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}