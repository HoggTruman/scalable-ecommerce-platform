using ProductAPI.Data;
using ProductAPI.DTOs;
using ProductAPI.Models;
using ProductAPI.Repositories;

namespace ProductAPITests.Repositories;

public class ProductRepositoryTests : IClassFixture<TestContainerFixture>, IDisposable
{
    private readonly ApplicationDbContext _testContext;
    private readonly ProductRepository _repository;

    public ProductRepositoryTests(TestContainerFixture container)
    {
        _testContext = Helpers.CreateTestDbContext(container.postgres);
        _repository = new ProductRepository(_testContext);
        Helpers.SetupDb(_testContext);
    }

    public void Dispose()
    {
        _testContext.Dispose();
    }


    [Fact]
    public void Helper_SetupDb()
    {
        // Arrange + Act
        List<Product> testProducts = TestData.GetProducts().ToList();
        var result = _testContext.Products.ToList();

        // Assert
        Assert.Equivalent(testProducts, result, true);
    }


    #region GetAll Tests

    [Fact]
    public void GetAll_ReturnsAllProducts()
    {
        // Arrange
        List<Product> testProducts = TestData.GetProducts().ToList();

        // Act
        var result = _repository.GetAll();

        // Assert
        Assert.Equivalent(testProducts, result, true);        
    }

    #endregion


    #region GetById Tests

    [Fact]
    public void GetById_WithMatchingId_ReturnsProduct()
    {
        // Arrange
        Product testProduct = TestData.GetProducts().ElementAt(3);

        // Act
        var result = _repository.GetById(testProduct.Id);

        // Assert
        Assert.Equivalent(testProduct, result, true);
    }


    [Fact]
    public void GetById_WithoutMatchingId_ReturnsNull()
    {
        // Arrange
        int testId = 999;

        // Act
        var result = _repository.GetById(testId);

        // Assert
        Assert.Null(result);
    }

    #endregion


    #region Create Tests

    [Fact]
    public void Create_WithNewId_ReturnsProduct()
    {
        // Arrange
        Product newProduct = new()
        {
            Id = 101,
            Name = "test",
            Description = "test",
            Price = 2,
            Stock = 0
        };

        CreateProductDto newProductDto = new()
        {
            Id = newProduct.Id,
            Name =  newProduct.Name,
            Description = newProduct.Description,
            Price = newProduct.Price,
        };

        // Act
        var result = _repository.Create(newProductDto);
        var queryResult = _testContext.Products.FirstOrDefault(x => x.Id == newProduct.Id);

        // Assert
        Assert.Equivalent(newProduct, result, true);
        Assert.Equivalent(newProduct, queryResult, true);
    }


    [Fact]
    public void Create_WithExistingId_ReturnsNull()
    {
        // Arrange
        CreateProductDto newProductDto = new()
        {
            Id = TestData.GetProducts().ElementAt(0).Id,
            Name =  "test",
            Description = "test",
            Price = 0,
        };

        // Act
        var result = _repository.Create(newProductDto);

        // Assert
        Assert.Null(result);
    }

    #endregion


    #region DeleteById Tests

    [Fact]
    public void DeleteById_WithMatchingId_ReturnsProduct()
    {
        // Arrange
        Product testProduct = TestData.GetProducts().ElementAt(0);

        // Act
        var result = _repository.DeleteById(testProduct.Id);
        var queryResult = _testContext.Products.FirstOrDefault(x => x.Id == testProduct.Id);

        // Assert
        Assert.Equivalent(testProduct, result, true);
        Assert.Null(queryResult);
    }


    [Fact]
    public void DeleteById_WithoutMatchingId_ReturnsNull()
    {
        // Arrange
        int testId = 999;

        // Act
        var result = _repository.DeleteById(testId);

        // Assert
        Assert.Null(result);
    }

    #endregion


    #region AddStock Tests

    [Fact]
    public void AddStock_WithValidAmount_ReturnsProduct()
    {
        // Arrange
        var product = _testContext.Products.First();
        int toAdd = 10;
        int expectedStock = product.Stock + toAdd;

        // Act
        var result = _repository.AddStock(product, toAdd);
        var queryResult = _testContext.Products.FirstOrDefault(x => x.Id == product.Id);

        // Assert
        Assert.Equal(expectedStock, result?.Stock);
        Assert.Equal(expectedStock, queryResult?.Stock);
    }


    [Theory]
    [InlineData(-5)]
    [InlineData(int.MaxValue)]
    public void AddStock_WithInvalidAmount_ReturnsNull(int toAdd)
    {
        // Arrange
        var product = _testContext.Products.First();
        int originalStock = product.Stock;

        // Act
        var result = _repository.AddStock(product, toAdd);
        var queryResult = _testContext.Products.FirstOrDefault(x => x.Id == product.Id);

        // Assert
        Assert.Null(result);
        Assert.Equal(originalStock, queryResult?.Stock);
    }

    #endregion


    #region RemoveStock Tests

    [Fact]
    public void RemoveStock_WithValidAmount_ReturnsProduct()
    {
        // Arrange
        var product = _testContext.Products.First();
        int toRemove = 5;
        int expectedStock = product.Stock - toRemove;

        // Act
        var result = _repository.RemoveStock(product, toRemove);
        var queryResult = _testContext.Products.FirstOrDefault(x => x.Id == product.Id);

        // Assert
        Assert.Equal(expectedStock, result?.Stock);
        Assert.Equal(expectedStock, queryResult?.Stock);
    }


    [Theory]
    [InlineData(-5)]
    [InlineData(int.MaxValue)]
    public void RemoveStock_WithInvalidAmount_ReturnsNull(int toRemove)
    {
        // Arrange
        var product = _testContext.Products.First();
        int originalStock = product.Stock;

        // Act
        var result = _repository.RemoveStock(product, toRemove);
        var queryResult = _testContext.Products.FirstOrDefault(x => x.Id == product.Id);

        // Assert
        Assert.Null(result);
        Assert.Equal(originalStock, queryResult?.Stock);
    }

    #endregion

}
