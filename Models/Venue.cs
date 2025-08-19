namespace SnapPlan.Models
{
    public class Venue
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public ICollection<Room> Rooms { get; set; }

    }

}
