namespace ProductAPI.DTOs;

public class GetAllProductsDto
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required double Price { get; set; }
    public required int Stock { get; set; }
}
