using System.ComponentModel.DataAnnotations;

namespace SnapPlan.Models.DTOs
{
    public class CreateAttenderDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = default!;

        [Required]
        public string Email { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;

        [Required]
        public string PhoneNumber { get; set; } = default!;
    }

    public class UpdateAttenderDto
    {
        [MinLength(3)]
        public string? Username { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [MinLength(3)]
        public string? Password { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }
    }

    public class AttenderResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
