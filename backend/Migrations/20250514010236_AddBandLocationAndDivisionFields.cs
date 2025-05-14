using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddBandLocationAndDivisionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Bands");

            migrationBuilder.DropColumn(
                name: "NumberOfMembers",
                table: "Bands");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Bands",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Conference",
                table: "Bands",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Division",
                table: "Bands",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Bands",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Bands");

            migrationBuilder.DropColumn(
                name: "Conference",
                table: "Bands");

            migrationBuilder.DropColumn(
                name: "Division",
                table: "Bands");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Bands");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Bands",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfMembers",
                table: "Bands",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
