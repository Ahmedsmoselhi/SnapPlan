using Microsoft.EntityFrameworkCore;
using SnapPlan.Models;

namespace SnapPlan.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Attender> Attenders { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<Speaker> Speakers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Minimal: avoid multiple cascade paths
            modelBuilder.Entity<Session>()
                .HasOne(s => s.Room)
                .WithMany()
                .HasForeignKey(s => s.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Venue)
                .WithMany()
                .HasForeignKey(e => e.VenueId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
