using Microsoft.EntityFrameworkCore;
using ProductAPI.Data;
using ProductAPI.DTOs;
using ProductAPI.Models;

namespace ProductAPI.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }


    public IEnumerable<Product> GetAll()
    {
        return _context.Products
            .AsNoTracking();
    }


    public Product? GetById(int id)
    {
        return _context.Products
            .FirstOrDefault(x => x.Id == id);
    }


    /// <summary>
    /// Creates a new product in the database if a product does not already exist
    /// with the provided id.
    /// </summary>
    /// <param name="createProductDto"></param>
    /// <returns>A Product if successful. Otherwise, null.</returns>
    public Product? Create(CreateProductDto createProductDto)
    {
        Product? existingProduct = _context.Products.FirstOrDefault(x => x.Id == createProductDto.Id);

        if (existingProduct != null)
        {
            return null;
        }

        Product newProduct = new()
        {
            Id = createProductDto.Id,
            Name = createProductDto.Name,
            Description = createProductDto.Description,
            Price = createProductDto.Price,
            Stock = 0
        };

        _context.Products.Add(newProduct);
        _context.SaveChanges();

        return newProduct;
    }


    public Product? DeleteById(int id)
    {
        Product? productToDelete = _context.Products.FirstOrDefault(x => x.Id == id);

        if (productToDelete == null)
        {
            return null;
        }

        _context.Remove(productToDelete);
        _context.SaveChanges();

        return productToDelete;
    }


    public Product? AddStock(Product product, int amount)
    {
        bool isMaxStockExceeded = int.MaxValue - product.Stock - amount < 0;

        if (amount <= 0 ||
            isMaxStockExceeded)
        {
            return null;
        }

        product.Stock += amount;
        _context.SaveChanges();

        return product;
    }


    public Product? RemoveStock(Product product, int amount)
    {
        if (amount <= 0 ||
            product.Stock - amount < 0)
        {
            return null;
        }

        product.Stock -= amount;
        _context.SaveChanges();

        return product;
    }    
}
