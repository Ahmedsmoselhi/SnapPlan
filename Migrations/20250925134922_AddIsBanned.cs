using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SnapPlan.Migrations
{
    /// <inheritdoc />
    public partial class AddIsBanned : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBanned",
                table: "Staffs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsBanned",
                table: "Attenders",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBanned",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "IsBanned",
                table: "Attenders");
        }
    }
}
