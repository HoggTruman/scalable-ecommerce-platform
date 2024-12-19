using Microsoft.AspNetCore.Mvc;

namespace ProductCatalogService.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase
{
    private readonly ILogger<ProductController> _logger;

    public ProductController(ILogger<ProductController> logger)
    {
        _logger = logger;
    }

    //[HttpGet(Name = "GetProduct")]
    //public IEnumerable<Product> Get()
    //{
    //    return;
    //}
}
