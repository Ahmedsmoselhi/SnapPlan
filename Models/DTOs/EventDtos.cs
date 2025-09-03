using System.ComponentModel.DataAnnotations;
using SnapPlan.Models;

namespace SnapPlan.Models.DTOs
{
    public class CreateEventDto
    {
        [Required]
        [MinLength(3)]
        public string Title { get; set; } = default!;

        [Required]
        [MinLength(10)]
        public string Description { get; set; } = default!;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int VenueId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Maximum tickets must be at least 1")]
        public int MaxTickets { get; set; }
    }

    public class UpdateEventDto
    {
        [MinLength(3)]
        public string? Title { get; set; }

        [MinLength(10)]
        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? VenueId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Maximum tickets must be at least 1")]
        public int? MaxTickets { get; set; }
    }

    public class UpdateEventStatusDto
    {
        [Required]
        public EventStatus Status { get; set; }
    }
}
