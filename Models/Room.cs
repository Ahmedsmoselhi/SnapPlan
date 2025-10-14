using System.Text.Json.Serialization;

namespace SnapPlan.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public int VenueId { get; set; }

        [JsonIgnore]
        public Venue Venue { get; set; }
    }
}
