namespace ProductAPI.DTOs;

public class GetAllProductsDto
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required decimal Price { get; set; }
    public required int Stock { get; set; }
}
