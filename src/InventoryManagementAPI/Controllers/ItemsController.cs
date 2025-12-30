// Controllers/ItemsController.cs
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventoryManagementAPI.DTOs;
using InventoryManagementAPI.Services;

namespace InventoryManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetItems([FromQuery] ItemQueryParams queryParams)
        {
            var result = await _itemService.GetItems(queryParams);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItem(int id)
        {
            var item = await _itemService.GetItem(id);
            if (item == null)
                return NotFound(new { message = "Item not found" });

            return Ok(item);
        }

        [HttpPost]
        [Authorize(Roles = "admin,manager")]
        public async Task<IActionResult> CreateItem(CreateItemDto createItemDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var item = await _itemService.CreateItem(createItemDto, userId);
                return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,manager")]
        public async Task<IActionResult> UpdateItem(int id, UpdateItemDto updateItemDto)
        {
            var item = await _itemService.UpdateItem(id, updateItemDto);
            if (item == null)
                return NotFound(new { message = "Item not found" });

            return Ok(item);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var result = await _itemService.DeleteItem(id);
            if (!result)
                return NotFound(new { message = "Item not found" });

            return Ok(new { message = "Item deleted successfully" });
        }

        [HttpGet("check-sku/{sku}")]
        public async Task<IActionResult> CheckSkuExists(string sku)
        {
            var exists = await _itemService.CheckSkuExists(sku);
            return Ok(new { exists });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockItems()
        {
            var items = await _itemService.GetLowStockItems();
            return Ok(items);
        }

        [HttpGet("total-value")]
        public async Task<IActionResult> GetTotalInventoryValue()
        {
            var value = await _itemService.GetTotalInventoryValue();
            return Ok(new { totalValue = value });
        }
    }
}