using ProductAPI.DTOs;
using ProductAPI.Models;

namespace ProductAPI.Mappers;

public static class ProductMappers
{
    public static GetAllProductsDto ToGetAllProductsDto(this Product product)
    {
        return new GetAllProductsDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            Stock = product.Stock
        };
    }


    public static GetProductDto ToGetProductDto(this Product product)
    {
        return new GetProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock
        };
    }
}
