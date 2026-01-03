// Models/InventoryMovement.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryManagementAPI.Models
{
    public class InventoryMovement
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Item")]
        public int ItemId { get; set; }

        [Required]
        [StringLength(20)]
        public string Type { get; set; } // "inbound", "outbound", "adjustment"

        public int Quantity { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Reference { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Item Item { get; set; }
        public virtual User User { get; set; }
    }
}