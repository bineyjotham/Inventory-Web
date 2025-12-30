// Models/Item.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryManagementAPI.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string SKU { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        public int Quantity { get; set; } = 0;
        public int LowStockThreshold { get; set; } = 10;

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [ForeignKey("Supplier")]
        public int SupplierId { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "in-stock"; // "in-stock", "low-stock", "out-of-stock"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastRestocked { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual Supplier Supplier { get; set; }
        public virtual ICollection<InventoryMovement> Movements { get; set; }
    }
}