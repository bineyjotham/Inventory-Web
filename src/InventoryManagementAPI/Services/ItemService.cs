// Services/ItemService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InventoryManagementAPI.Data;
using InventoryManagementAPI.DTOs;
using InventoryManagementAPI.Models;

namespace InventoryManagementAPI.Services
{
    public class ItemService : IItemService
    {
        private readonly ApplicationDbContext _context;

        public ItemService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ItemDto>> GetItems(ItemQueryParams queryParams)
        {
            var query = _context.Items
                .Include(i => i.Category)
                .Include(i => i.Supplier)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(queryParams.Search))
            {
                var search = queryParams.Search.ToLower();
                query = query.Where(i => 
                    i.Name.ToLower().Contains(search) ||
                    i.SKU.ToLower().Contains(search) ||
                    i.Description.ToLower().Contains(search) ||
                    i.Location.ToLower().Contains(search));
            }

            if (!string.IsNullOrEmpty(queryParams.Category) && queryParams.Category != "all")
            {
                query = query.Where(i => i.Category.Name == queryParams.Category);
            }

            if (!string.IsNullOrEmpty(queryParams.Status) && queryParams.Status != "all")
            {
                query = query.Where(i => i.Status == queryParams.Status);
            }

            // Apply sorting
            query = queryParams.SortBy?.ToLower() switch
            {
                "quantity" => queryParams.SortDescending 
                    ? query.OrderByDescending(i => i.Quantity)
                    : query.OrderBy(i => i.Quantity),
                "value" => queryParams.SortDescending
                    ? query.OrderByDescending(i => i.Quantity * i.UnitPrice)
                    : query.OrderBy(i => i.Quantity * i.UnitPrice),
                "lastupdated" => queryParams.SortDescending
                    ? query.OrderByDescending(i => i.UpdatedAt)
                    : query.OrderBy(i => i.UpdatedAt),
                "sku" => queryParams.SortDescending
                    ? query.OrderByDescending(i => i.SKU)
                    : query.OrderBy(i => i.SKU),
                _ => queryParams.SortDescending
                    ? query.OrderByDescending(i => i.Name)
                    : query.OrderBy(i => i.Name)
            };

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var items = await query
                .Skip((queryParams.Page - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .Select(i => new ItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    SKU = i.SKU,
                    Description = i.Description,
                    CategoryId = i.CategoryId,
                    CategoryName = i.Category.Name,
                    Quantity = i.Quantity,
                    LowStockThreshold = i.LowStockThreshold,
                    UnitPrice = i.UnitPrice,
                    SupplierId = i.SupplierId,
                    SupplierName = i.Supplier.Name,
                    Location = i.Location,
                    Status = i.Status,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt,
                    LastRestocked = i.LastRestocked
                })
                .ToListAsync();

            return new PagedResult<ItemDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = queryParams.Page,
                PageSize = queryParams.PageSize
            };
        }

        public async Task<ItemDto> GetItem(int id)
        {
            var item = await _context.Items
                .Include(i => i.Category)
                .Include(i => i.Supplier)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
                return null;

            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                SKU = item.SKU,
                Description = item.Description,
                CategoryId = item.CategoryId,
                CategoryName = item.Category.Name,
                Quantity = item.Quantity,
                LowStockThreshold = item.LowStockThreshold,
                UnitPrice = item.UnitPrice,
                SupplierId = item.SupplierId,
                SupplierName = item.Supplier.Name,
                Location = item.Location,
                Status = item.Status,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt,
                LastRestocked = item.LastRestocked
            };
        }

        public async Task<Item> CreateItem(CreateItemDto createItemDto, int userId)
        {
            // Check if SKU already exists
            if (await CheckSkuExists(createItemDto.SKU))
                throw new Exception($"SKU '{createItemDto.SKU}' already exists");

            var item = new Item
            {
                Name = createItemDto.Name,
                SKU = createItemDto.SKU.ToUpper(),
                Description = createItemDto.Description,
                CategoryId = createItemDto.CategoryId,
                Quantity = createItemDto.Quantity,
                LowStockThreshold = createItemDto.LowStockThreshold,
                UnitPrice = createItemDto.UnitPrice,
                SupplierId = createItemDto.SupplierId,
                Location = createItemDto.Location,
                Status = CalculateStatus(createItemDto.Quantity, createItemDto.LowStockThreshold),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (createItemDto.Quantity > 0)
                item.LastRestocked = DateTime.UtcNow;

            _context.Items.Add(item);

            // Record initial movement
            if (createItemDto.Quantity > 0)
            {
                var movement = new InventoryMovement
                {
                    ItemId = item.Id,
                    Type = "inbound",
                    Quantity = createItemDto.Quantity,
                    UserId = userId,
                    Reference = $"INIT-{item.SKU}",
                    Notes = "Initial stock",
                    MovementDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };
                _context.InventoryMovements.Add(movement);
            }

            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<Item> UpdateItem(int id, UpdateItemDto updateItemDto)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
                return null;

            if (!string.IsNullOrEmpty(updateItemDto.Name))
                item.Name = updateItemDto.Name;

            if (!string.IsNullOrEmpty(updateItemDto.Description))
                item.Description = updateItemDto.Description;

            if (updateItemDto.CategoryId.HasValue)
                item.CategoryId = updateItemDto.CategoryId.Value;

            if (updateItemDto.Quantity.HasValue)
            {
                item.Quantity = updateItemDto.Quantity.Value;
                if (updateItemDto.Quantity > 0)
                    item.LastRestocked = DateTime.UtcNow;
            }

            if (updateItemDto.LowStockThreshold.HasValue)
                item.LowStockThreshold = updateItemDto.LowStockThreshold.Value;

            if (updateItemDto.UnitPrice.HasValue)
                item.UnitPrice = updateItemDto.UnitPrice.Value;

            if (updateItemDto.SupplierId.HasValue)
                item.SupplierId = updateItemDto.SupplierId.Value;

            if (!string.IsNullOrEmpty(updateItemDto.Location))
                item.Location = updateItemDto.Location;

            item.Status = CalculateStatus(item.Quantity, item.LowStockThreshold);
            item.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
                return false;

            // Check if item has movements
            var hasMovements = await _context.InventoryMovements
                .AnyAsync(m => m.ItemId == id);

            if (hasMovements)
            {
                // Soft delete
                item.Status = "deleted";
                await _context.SaveChangesAsync();
                return true;
            }

            // Hard delete if no movements
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckSkuExists(string sku)
        {
            return await _context.Items.AnyAsync(i => i.SKU == sku.ToUpper());
        }

        public async Task<IEnumerable<StockAlertDto>> GetLowStockItems()
        {
            var items = await _context.Items
                .Where(i => i.Quantity <= i.LowStockThreshold && i.Status != "out-of-stock")
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

            return items;
        }

        public async Task<decimal> GetTotalInventoryValue()
        {
            return await _context.Items
                .Where(i => i.Status != "deleted")
                .SumAsync(i => i.Quantity * i.UnitPrice);
        }

        private string CalculateStatus(int quantity, int lowStockThreshold)
        {
            if (quantity == 0) return "out-of-stock";
            if (quantity <= lowStockThreshold) return "low-stock";
            return "in-stock";
        }
    }
}