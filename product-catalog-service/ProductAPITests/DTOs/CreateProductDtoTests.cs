using ProductAPI.DTOs;
using System.ComponentModel.DataAnnotations;

namespace ProductAPITests.DTOs;



public class CreateProductDtoTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(0.1)]
    [InlineData(1000)]
    [InlineData(1.0)]
    [InlineData(5.00)]
    [InlineData(1.05)]
    [InlineData(5.10)]    
    [InlineData(6.99)]
    [InlineData(9999.57)]
    [InlineData(2.1000)]
    public void ValidModelState_WithValidPrice(decimal price)
    {
        // Arrange
        CreateProductDto testDTO = new()
        {
            Id = 1,
            Name = "test",
            Description = "test",
            Price = price
        };

        var context = new ValidationContext(testDTO, null, null);
        var results = new List<ValidationResult>();        

        // Act
        var isModelStateValid = Validator.TryValidateObject(testDTO, context, results, true);

        // Assert
        Assert.True(isModelStateValid);
    }


    [Theory]
    [InlineData(-1)]
    [InlineData(2.111)]
    [InlineData(0.0001)]
    public void InvalidModelState_WithInvalidPrice(decimal price)
    {
        // Arrange
        CreateProductDto testDTO = new()
        {
            Id = 1,
            Name = "test",
            Description = "test",
            Price = price
        };

        var context = new ValidationContext(testDTO, null, null);
        var results = new List<ValidationResult>();    

        // Act
        var isModelStateValid = Validator.TryValidateObject(testDTO, context, results, true);

        // Assert
        Assert.False(isModelStateValid);
    }
}
