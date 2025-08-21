namespace SnapPlan.Models
{
    public class Speaker
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }

        public ICollection<Session> Sessions { get; set; }
    }
} 