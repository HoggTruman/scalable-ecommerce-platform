namespace ProductAPI.DTOs;

public class CreateProductDto
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required double Price { get; set; }
}
