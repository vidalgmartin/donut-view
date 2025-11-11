using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.Database;
using server.Models;
using System.Threading.Tasks;

public class UserControllerTests
{
    private UsersController CreateControllerWithUser(ServerDbContext context, int userId)
    {
        var controller = new UsersController(context);

        // Mock the user identity with a claim for "id"
        var claims = new List<Claim> { new Claim("id", userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var principal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };

        return controller;
    }

    [Fact]
    public async Task GetUser_ReturnsOk_WhenUserExists()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ServerDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetUser_Exists")
            .Options;

        var user = new User { Id = 1, Username = "TestUser", Email = "test@example.com" };

        using (var context = new ServerDbContext(options))
        {
            context.Users.Add(user);
            context.SaveChanges();
        }

        using (var context = new ServerDbContext(options))
        {
            var controller = CreateControllerWithUser(context, user.Id);

            // Act
            var result = await controller.GetUser();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedUser = Assert.IsType<User>(okResult.Value);
            Assert.Equal("TestUser", returnedUser.Username);
        }
    }

    [Fact]
    public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ServerDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetUser_NotFound")
            .Options;

        using var context = new ServerDbContext(options);
        var controller = CreateControllerWithUser(context, userId: 999); // non-existent user

        // Act
        var result = await controller.GetUser();

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
