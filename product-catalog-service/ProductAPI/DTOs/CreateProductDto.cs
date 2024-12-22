using System.ComponentModel.DataAnnotations;

namespace ProductAPI.DTOs;

public class CreateProductDto : IValidatableObject
{
    [Range(1, int.MaxValue, ErrorMessage = "Value for {0} must be between {1} and {2}.")]
    public required int Id { get; set; }

    [MinLength(1)]
    [MaxLength(100)]
    public required string Name { get; set; }

    [MinLength(1)]
    public required string Description { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Value for {0} must be between {1} and {2}.")]
    public required double Price { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!IsTwoDecimalPlacesOrLess(Price))
        {
            yield return new ValidationResult("Price should have at most two decimal places.");
        }
        
    }

    private static bool IsTwoDecimalPlacesOrLess(double d)
    {
        double decimalPart = Math.Abs(d - Math.Truncate(d));

        // This is greater than 0 if d goes beyond 2 decimal places
        double excess = decimalPart * 100 - Math.Truncate(decimalPart * 100);

        return excess == 0;
    }
}
