namespace SnapPlan.Models
{
    public class Staff : User
    {
        public StaffRole Role { get; set; } // "Organizer" or "Admin"
        public ICollection<Event> ManagedEvents { get; set; } = new List<Event>();
    }

    public enum StaffRole
    {
        Organizer,
        Admin
    }
}
