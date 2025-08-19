namespace SnapPlan.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int OrganizerId { get; set; }
        public Staff Organizer { get; set; }

        public ICollection<Session> Sessions { get; set; }
        public int VenueId { get; set; }
        public Venue Venue { get; set; }
    }

}
