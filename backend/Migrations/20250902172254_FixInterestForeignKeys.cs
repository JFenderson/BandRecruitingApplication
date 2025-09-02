using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FixInterestForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interests_AspNetUsers_StudentId",
                table: "Interests");

            migrationBuilder.DropForeignKey(
                name: "FK_Interests_Bands_BandId",
                table: "Interests");

            migrationBuilder.DropIndex(
                name: "IX_Interests_StudentId",
                table: "Interests");

            migrationBuilder.AlterColumn<DateTime>(
                name: "InterestDate",
                table: "Interests",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<Guid>(
                name: "BandId",
                table: "Interests",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsInterested",
                table: "Interests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Interests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Interests_StudentId_BandId",
                table: "Interests",
                columns: new[] { "StudentId", "BandId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_AspNetUsers_StudentId",
                table: "Interests",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_Bands_BandId",
                table: "Interests",
                column: "BandId",
                principalTable: "Bands",
                principalColumn: "BandId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interests_AspNetUsers_StudentId",
                table: "Interests");

            migrationBuilder.DropForeignKey(
                name: "FK_Interests_Bands_BandId",
                table: "Interests");

            migrationBuilder.DropIndex(
                name: "IX_Interests_StudentId_BandId",
                table: "Interests");

            migrationBuilder.DropColumn(
                name: "IsInterested",
                table: "Interests");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Interests");

            migrationBuilder.AlterColumn<DateTime>(
                name: "InterestDate",
                table: "Interests",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<Guid>(
                name: "BandId",
                table: "Interests",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_Interests_StudentId",
                table: "Interests",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_AspNetUsers_StudentId",
                table: "Interests",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_Bands_BandId",
                table: "Interests",
                column: "BandId",
                principalTable: "Bands",
                principalColumn: "BandId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
