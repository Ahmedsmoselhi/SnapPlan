namespace SnapPlan.Models
{
    public class Attender : User
    {
        public string PhoneNumber { get; set; }
        public ICollection<Registration> Registrations { get; set; }
    }
}
