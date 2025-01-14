using Microsoft.EntityFrameworkCore;
using ProductAPI.Data;
using Testcontainers.PostgreSql;

namespace ProductAPITests;

public class Helpers
{
    public static ApplicationDbContext CreateTestDbContext(PostgreSqlContainer container)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(container.GetConnectionString(), options => 
                options.SetPostgresVersion(17, 2))
            .EnableSensitiveDataLogging()
            .Options;

        return new ApplicationDbContext(options);
    }

    public static void SetupDb(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();
        context.Products.ExecuteDelete();        
        context.Products.AddRange(TestData.GetProducts());
        context.SaveChanges();
    }
}
