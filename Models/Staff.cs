namespace SnapPlan.Models
{
    public class Staff : User
    {
        public StaffRole Role { get; set; } // "Organizer" or "Admin"
        public string OrganizationName { get; set; }
        public ICollection<Event> ManagedEvents { get; set; }
    }

    public enum StaffRole
    {
        Organizer,
        Admin
    }
}
