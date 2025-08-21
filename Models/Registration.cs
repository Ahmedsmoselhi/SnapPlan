namespace SnapPlan.Models
{
    public class Registration
    {
        public int Id { get; set; }
        public int AttenderId { get; set; }
        public Attender Attender { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }

        public DateTime RegistrationDate { get; set; }
    }

}
