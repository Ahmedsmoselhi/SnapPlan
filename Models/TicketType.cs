namespace SnapPlan.Models
{
    public class TicketType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }
    }
} 