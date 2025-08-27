using System.ComponentModel.DataAnnotations;

namespace SnapPlan.Models.DTOs
{
    public class CreateVenueDto
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; } = default!;

        [Required]
        public string Address { get; set; } = default!; // Maps to Location in Venue model
    }

    public class UpdateVenueDto
    {
        [MinLength(2)]
        public string? Name { get; set; }

        public string? Address { get; set; } // Maps to Location in Venue model
    }
}
