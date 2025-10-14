using System.ComponentModel.DataAnnotations;

namespace SnapPlan.Models.DTOs
{
    public class CreateRoomDto
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; } = default!;

        [Required]
        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        [Required]
        public int VenueId { get; set; }
    }

    public class UpdateRoomDto
    {
        [MinLength(2)]
        public string? Name { get; set; }

        [Range(1, int.MaxValue)]
        public int? Capacity { get; set; }
    }
}
