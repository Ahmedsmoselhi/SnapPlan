using System.ComponentModel.DataAnnotations;

namespace SnapPlan.Models.DTOs
{
    public class CreateSpeakerDto
    {
        [Required]
        [MinLength(2)]
        public string FullName { get; set; } = default!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        [MinLength(10)]
        public string Bio { get; set; } = default!;
    }

    public class UpdateSpeakerDto
    {
        [MinLength(2)]
        public string? FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [MinLength(10)]
        public string? Bio { get; set; }
    }
}
