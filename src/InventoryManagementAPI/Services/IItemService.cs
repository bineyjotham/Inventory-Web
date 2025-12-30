// Services/IItemService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using InventoryManagementAPI.DTOs;
using InventoryManagementAPI.Models;

namespace InventoryManagementAPI.Services
{
    public interface IItemService
    {
        Task<PagedResult<ItemDto>> GetItems(ItemQueryParams queryParams);
        Task<ItemDto> GetItem(int id);
        Task<Item> CreateItem(CreateItemDto createItemDto, int userId);
        Task<Item> UpdateItem(int id, UpdateItemDto updateItemDto);
        Task<bool> DeleteItem(int id);
        Task<bool> CheckSkuExists(string sku);
        Task<IEnumerable<StockAlertDto>> GetLowStockItems();
        Task<decimal> GetTotalInventoryValue();
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}