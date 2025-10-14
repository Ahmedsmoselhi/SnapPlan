using System.ComponentModel.DataAnnotations;

namespace SnapPlan.Models.DTOs
{
    public class CreateRegistrationDto
    {
        [Required]
        public int EventId { get; set; }
    }
}
