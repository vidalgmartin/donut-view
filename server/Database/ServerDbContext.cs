using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Database
{
    public class ServerDbContext : DbContext
    {
        public ServerDbContext(DbContextOptions<ServerDbContext> options) : base(options) { }

        public DbSet<Model3D> Models3D { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
