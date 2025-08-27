using System.ComponentModel.DataAnnotations;

namespace SnapPlan.Models.DTOs
{
    public class CreateSessionDto
    {
        [Required]
        [MinLength(3)]
        public string Title { get; set; } = default!;

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public int EventId { get; set; }

        [Required]
        public int SpeakerId { get; set; }

        [Required]
        public int RoomId { get; set; }
    }

    public class UpdateSessionDto
    {
        [MinLength(3)]
        public string? Title { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public int? SpeakerId { get; set; }

        public int? RoomId { get; set; }
    }
}
