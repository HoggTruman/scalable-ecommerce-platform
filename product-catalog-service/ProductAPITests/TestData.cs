using ProductAPI.Models;

namespace ProductAPITests;

public static class TestData
{
    public static IEnumerable<Product> GetProducts()
    {
        return [
            new Product
            {
                Id = 1,
                Name = "Cheddar",
                Description = "Cheddar cheese is a natural cheese that is relatively hard, off-white, and sometimes sharp-tasting.",
                Price = 3.99M,
                Stock = 10
            },
            new Product
            {
                Id = 2,
                Name = "Brie",
                Description = "Brie is a soft cow's-milk cheese named after Brie, the French region from which it originated.",
                Price = 4.99M,
                Stock = 0
            },
            new Product
            {
                Id = 3,
                Name = "Feta",
                Description = "Feta is a Greek brined white cheese made from sheep milk or from a mixture of sheep and goat milk.",
                Price = 2.49M,
                Stock = 0
            },
            new Product
            {
                Id = 4,
                Name = "Gouda",
                Description = "Gouda cheese is a creamy, yellow cow's milk cheese originating from the Netherlands.",
                Price = 6.99M,
                Stock = 0
            },
            new Product
            {
                Id = 5,
                Name = "Edam",
                Description = "Edam is a semi-hard cheese that originated in the Netherlands, and is named after the town of Edam in the province of North Holland.",
                Price = 3.49M,
                Stock = 0
            },
        ];
    }
}
