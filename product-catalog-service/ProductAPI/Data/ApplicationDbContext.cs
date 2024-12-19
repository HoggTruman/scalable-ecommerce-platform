using Microsoft.EntityFrameworkCore;
using ProductAPI.Models;

namespace ProductAPI.Data;

public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
        
    }
}