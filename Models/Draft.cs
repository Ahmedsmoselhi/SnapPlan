namespace SnapPlan.Models
{
    public class Draft
    {
        public int Id { get; set; }

        // Same shape as Event, but all optional (organizer may start with just a title)
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // Ownership
        public int OrganizerId { get; set; }
        public Staff? Organizer { get; set; }

        // Status/meta
        public int? VenueId { get; set; }
        public Venue? Venue { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAtUtc { get; set; }
        public bool IsConvertedToEvent { get; set; } = false;
    }
}


