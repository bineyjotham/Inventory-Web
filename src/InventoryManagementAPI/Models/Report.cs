// Models/Report.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryManagementAPI.Models
{
    public class Report
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(50)]
        public string Type { get; set; } // "inventory", "movement", "financial"

        [ForeignKey("User")]
        public int GeneratedBy { get; set; }

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string Period { get; set; }

        [StringLength(500)]
        public string FilePath { get; set; }

        public string Parameters { get; set; } // JSON string of report parameters

        // Navigation property
        public virtual User User { get; set; }
    }
}