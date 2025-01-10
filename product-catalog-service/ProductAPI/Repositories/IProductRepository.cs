using ProductAPI.DTOs;
using ProductAPI.Models;

namespace ProductAPI.Repositories;

public interface IProductRepository
{
    public IEnumerable<Product> GetAll();

    public Product? GetById(int id);

    public Product? Create(CreateProductDto createProductDto);

    public Product? DeleteById(int id);

    public Product? AddStock(Product product, int amount);

    public Product? RemoveStock(Product product, int amount);
}
