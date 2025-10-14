using System.ComponentModel.DataAnnotations;
using SnapPlan.Models;

namespace SnapPlan.Models.DTOs
{
    public class CreateStaffDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = default!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        [MinLength(3)]
        public string Password { get; set; } = default!;

        [Required]
        public StaffRole Role { get; set; }
    }

    public class UpdateStaffDto
    {
        [MinLength(3)]
        public string? Username { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [MinLength(3)]
        public string? Password { get; set; }

        public StaffRole? Role { get; set; }
    }

    public class StaffResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int ManagedEventsCount { get; set; }
    }
}
