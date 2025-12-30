// Services/IAuthService.cs
using System.Threading.Tasks;
using InventoryManagementAPI.DTOs;
using InventoryManagementAPI.Models;

namespace InventoryManagementAPI.Services
{
    public interface IAuthService
    {
        Task<User> Register(RegisterDto registerDto);
        Task<AuthResponseDto> Login(LoginDto loginDto);
        Task<UserDto> GetCurrentUser(int userId);
        Task<bool> UserExists(string email);
        Task<bool> ChangePassword(int userId, string currentPassword, string newPassword);
    }
}