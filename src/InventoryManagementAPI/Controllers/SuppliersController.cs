// Controllers/SuppliersController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagementAPI.Data;
using InventoryManagementAPI.DTOs;
using InventoryManagementAPI.Models;

namespace InventoryManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SuppliersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSuppliers([FromQuery] string status = null)
        {
            var query = _context.Suppliers
                .Include(s => s.Items)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status) && status != "all")
            {
                query = query.Where(s => s.Status == status);
            }

            var suppliers = await query
                .Select(s => new SupplierDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ContactPerson = s.ContactPerson,
                    Email = s.Email,
                    Phone = s.Phone,
                    Address = s.Address,
                    ItemsSupplied = s.Items.Count,
                    Status = s.Status,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                })
                .ToListAsync();

            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplier(int id)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (supplier == null)
                return NotFound(new { message = "Supplier not found" });

            return Ok(new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                ItemsSupplied = supplier.Items.Count,
                Status = supplier.Status,
                CreatedAt = supplier.CreatedAt,
                UpdatedAt = supplier.UpdatedAt
            });
        }

        [HttpPost]
        [Authorize(Roles = "admin,manager")]
        public async Task<IActionResult> CreateSupplier(CreateSupplierDto createSupplierDto)
        {
            // Check if supplier email already exists
            var existingSupplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.Email == createSupplierDto.Email);

            if (existingSupplier != null)
                return BadRequest(new { message = "Supplier email already exists" });

            var supplier = new Supplier
            {
                Name = createSupplierDto.Name,
                ContactPerson = createSupplierDto.ContactPerson,
                Email = createSupplierDto.Email,
                Phone = createSupplierDto.Phone,
                Address = createSupplierDto.Address,
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, supplier);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,manager")]
        public async Task<IActionResult> UpdateSupplier(int id, UpdateSupplierDto updateSupplierDto)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
                return NotFound(new { message = "Supplier not found" });

            // Check if new email already exists
            if (!string.IsNullOrEmpty(updateSupplierDto.Email) && updateSupplierDto.Email != supplier.Email)
            {
                var existingSupplier = await _context.Suppliers
                    .FirstOrDefaultAsync(s => s.Email == updateSupplierDto.Email && s.Id != id);

                if (existingSupplier != null)
                    return BadRequest(new { message = "Supplier email already exists" });
            }

            if (!string.IsNullOrEmpty(updateSupplierDto.Name))
                supplier.Name = updateSupplierDto.Name;

            if (!string.IsNullOrEmpty(updateSupplierDto.ContactPerson))
                supplier.ContactPerson = updateSupplierDto.ContactPerson;

            if (!string.IsNullOrEmpty(updateSupplierDto.Email))
                supplier.Email = updateSupplierDto.Email;

            if (!string.IsNullOrEmpty(updateSupplierDto.Phone))
                supplier.Phone = updateSupplierDto.Phone;

            if (!string.IsNullOrEmpty(updateSupplierDto.Address))
                supplier.Address = updateSupplierDto.Address;

            if (!string.IsNullOrEmpty(updateSupplierDto.Status))
                supplier.Status = updateSupplierDto.Status;

            supplier.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(supplier);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (supplier == null)
                return NotFound(new { message = "Supplier not found" });

            if (supplier.Items.Any())
                return BadRequest(new { message = "Cannot delete supplier with existing items" });

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Supplier deleted successfully" });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetSupplierStats()
        {
            var stats = new
            {
                TotalSuppliers = await _context.Suppliers.CountAsync(),
                ActiveSuppliers = await _context.Suppliers.CountAsync(s => s.Status == "active"),
                InactiveSuppliers = await _context.Suppliers.CountAsync(s => s.Status == "inactive"),
                TotalItemsSupplied = await _context.Items.CountAsync()
            };

            return Ok(stats);
        }
    }
}