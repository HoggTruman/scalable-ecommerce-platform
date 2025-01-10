using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Moq;
using ProductAPI.Controllers;
using ProductAPI.DTOs;
using ProductAPI.Models;
using ProductAPI.Repositories;

namespace ProductAPITests.Controllers;

public class ProductControllerTests
{
    private readonly Mock<IProductRepository> _repoStub;

    public ProductControllerTests()
    {
        _repoStub = new Mock<IProductRepository>();
    }




    #region GetAll Tests

    [Fact]
    public void GetAll_WithProducts_ReturnsOk()
    {
        // Arrange
        _repoStub.Setup(x => x.GetAll()).Returns(TestData.GetProducts());

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.GetAll();
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
    }


    [Fact]
    public void GetAll_WithoutProducts_ReturnsOk()
    {
        // Arrange
        _repoStub.Setup(x => x.GetAll()).Returns([]);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.GetAll();
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
    }

    #endregion


    #region GetById Tests

    [Fact]
    public void GetById_WithMatchingProduct_ReturnsOk()
    {
        // Arrange
        var testProduct = TestData.GetProducts().ElementAt(0);

        _repoStub.Setup(x => x.GetById(testProduct.Id)).Returns(testProduct);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.GetById(testProduct.Id);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
    }


    [Fact]
    public void GetById_WithoutMatchingProduct_ReturnsNotFound()
    {
        // Arrange
        int testId = 999;
        _repoStub.Setup(x => x.GetById(testId)).Returns((Product?)null);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.GetById(testId);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
    }

    #endregion


    #region Create Tests

    [Fact]
    public void Create_WithInvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        CreateProductDto productDto = new()
        {
            Id = 1,
            Name = "test",
            Description = "test",
            Price = 10
        };

        ProductController controller = new(_repoStub.Object);
        controller.ModelState.AddModelError("test", "test");
        

        //_repoStub.Setup(x => x.Create(productDto)).Returns();

        // Act
        var result = controller.Create(productDto);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status400BadRequest, statusCodeResult.StatusCode);
    }


    [Fact]
    public void Create_WhenProductIdAlreadyExists_ReturnsBadRequest()
    {
        /// Arrange
        CreateProductDto productDto = new()
        {
            Id = 1,
            Name = "test",
            Description = "test",
            Price = 10
        };

        // null returns mean product already exists with provided id
        _repoStub.Setup(x => x.Create(productDto)).Returns((Product?)null); 

        ProductController controller = new(_repoStub.Object);

        /// Act
        var result = controller.Create(productDto);
        var statusCodeResult = (IStatusCodeActionResult)result;

        /// Assert
        Assert.Equal(StatusCodes.Status400BadRequest, statusCodeResult.StatusCode);
    }


    [Fact]
    public void Create_WithValidDto_ReturnsCreated()
    {
        // Arrange
        CreateProductDto productDto = new()
        {
            Id = 1,
            Name = "test",
            Description = "test",
            Price = 10
        };

        Product product = new()
        {
            Id = productDto.Id,
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Stock = 0
        };

        _repoStub.Setup(x => x.Create(productDto)).Returns(product);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.Create(productDto);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status201Created, statusCodeResult.StatusCode);
    }

    #endregion


    #region DeleteById Tests

    [Fact]
    public void DeleteById_WithMatchingProduct_ReturnsNoContent()
    {
        // Arrange
        var testProduct = TestData.GetProducts().ElementAt(0);

        _repoStub.Setup(x => x.DeleteById(testProduct.Id)).Returns(testProduct);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.DeleteById(testProduct.Id);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status204NoContent, statusCodeResult.StatusCode);
    }


    [Fact]
    public void DeleteById_WithoutMatchingProduct_ReturnsNotFound()
    {
        // Arrange
        int testId = 999;
        _repoStub.Setup(x => x.DeleteById(testId)).Returns((Product?)null);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.DeleteById(testId);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
    }

    #endregion


    #region AddStock Tests

    [Fact]
    public void AddStock_WithValidInput_ReturnsOk()
    {
        // Arrange
        int addedStock = 10;

        var testProduct = TestData.GetProducts().ElementAt(0);
        Product updatedProduct = new()
        {
            Id = testProduct.Id,
            Name = testProduct.Name,
            Description = testProduct.Description,
            Price = testProduct.Price,
            Stock = testProduct.Stock + addedStock
        };

        _repoStub.Setup(x => x.GetById(testProduct.Id)).Returns(testProduct);
        _repoStub.Setup(x => x.AddStock(testProduct, addedStock)).Returns(updatedProduct);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.AddStock(testProduct.Id, addedStock);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
    }


    [Fact]
    public void AddStock_WithoutMatchingProduct_ReturnsNotFound()
    {
        // Arrange
        int addedStock = 10;
        int testId = 999;

        _repoStub.Setup(x => x.GetById(testId)).Returns((Product?)null);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.AddStock(testId, addedStock);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
    }


    [Theory]
    [InlineData(-5)]
    [InlineData(int.MaxValue)]
    public void AddStock_WithInvalidStockAmount_ReturnsBadRequest(int addedStock)
    {
        // Arrange
        var testProduct = TestData.GetProducts().ElementAt(0);

        _repoStub.Setup(x => x.GetById(testProduct.Id)).Returns(testProduct);
        _repoStub.Setup(x => x.AddStock(testProduct, addedStock)).Returns((Product?)null);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.AddStock(testProduct.Id, addedStock);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status400BadRequest, statusCodeResult.StatusCode);
    }

    #endregion


    #region RemoveStock Tests

    [Fact]
    public void RemoveStock_WithValidInput_ReturnsOk()
    {
        // Arrange
        int removedStock = 1;

        var testProduct = TestData.GetProducts().ElementAt(0);
        Product updatedProduct = new()
        {
            Id = testProduct.Id,
            Name = testProduct.Name,
            Description = testProduct.Description,
            Price = testProduct.Price,
            Stock = testProduct.Stock - removedStock
        };

        _repoStub.Setup(x => x.GetById(testProduct.Id)).Returns(testProduct);
        _repoStub.Setup(x => x.RemoveStock(testProduct, removedStock)).Returns(updatedProduct);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.RemoveStock(testProduct.Id, removedStock);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
    }


    [Fact]
    public void RemoveStock_WithoutMatchingProduct_ReturnsNotFound()
    {
        // Arrange
        int removedStock = 10;
        int testId = 999;

        _repoStub.Setup(x => x.GetById(testId)).Returns((Product?)null);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.RemoveStock(testId, removedStock);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
    }


    [Theory]
    [InlineData(-5)]
    [InlineData(int.MaxValue)]
    public void RemoveStock_WithInvalidStockAmount_ReturnsBadRequest(int removedStock)
    {
        // Arrange
        var testProduct = TestData.GetProducts().ElementAt(0);

        _repoStub.Setup(x => x.GetById(testProduct.Id)).Returns(testProduct);
        _repoStub.Setup(x => x.RemoveStock(testProduct, removedStock)).Returns((Product?)null);

        ProductController controller = new(_repoStub.Object);

        // Act
        var result = controller.RemoveStock(testProduct.Id, removedStock);
        var statusCodeResult = (IStatusCodeActionResult)result;

        // Assert
        Assert.Equal(StatusCodes.Status400BadRequest, statusCodeResult.StatusCode);
    }


    #endregion
}
