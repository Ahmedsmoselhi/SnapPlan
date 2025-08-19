namespace SnapPlan.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public int VenueId { get; set; }

        public Venue Venue { get; set; }
    }
}
