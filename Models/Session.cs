using System.Text.Json.Serialization;

namespace SnapPlan.Models
{
    public class Session
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int EventId { get; set; }
        [JsonIgnore]
        public Event Event { get; set; }

        public int RoomId { get; set; }
        [JsonIgnore]
        public Room Room { get; set; }

        public int SpeakerId { get; set; }
        [JsonIgnore]
        public Speaker Speaker { get; set; }
    }

}
