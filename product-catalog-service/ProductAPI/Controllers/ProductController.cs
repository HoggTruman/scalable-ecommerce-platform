using Microsoft.AspNetCore.Mvc;
using ProductAPI.DTOs;
using ProductAPI.Mappers;
using ProductAPI.Repositories;

namespace ProductAPI.Controllers;

[Route("api/product")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductRepository _repository;

    public ProductController(IProductRepository repository)
    {
        _repository = repository;
    }


    [HttpGet]
    [Produces("application/json")]
    public IActionResult GetAll()
    {
        var products = _repository.GetAll()
            .Select(x => x.ToGetAllProductsDto());

        return Ok(products);
    }


    [HttpGet("{id:int}")]
    [Produces("application/json")]
    public IActionResult GetById([FromRoute] int id)
    {
        var product = _repository.GetById(id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product.ToGetProductDto());
    }


    [HttpPost]
    [Produces("application/json")]
    public IActionResult Create([FromBody] CreateProductDto productDto)
    {
        if (ModelState.IsValid == false)
        {
            return BadRequest(ModelState);
        }

        var newProduct = _repository.Create(productDto);

        if (newProduct == null)
        {
            return BadRequest($"Product with id {productDto.Id} already exists.");
        }

        return CreatedAtAction(nameof(GetById), new { id = newProduct.Id }, newProduct.ToGetProductDto());
    }


    [HttpDelete]
    public IActionResult DeleteById([FromRoute] int id)
    {
        var deletedProduct = _repository.DeleteById(id);

        if (deletedProduct == null)
        {
            return NotFound();
        }

        return NoContent();
    }


    [HttpPatch("addstock/{id:int}/{amount:int}")]
    [Produces("application/json")]
    public IActionResult AddStock([FromRoute] int id, [FromRoute] int amount)
    {
        var product = _repository.GetById(id);

        if (product == null)
        {
            return NotFound();
        }

        var updatedProduct = _repository.AddStock(product, amount);

        if (updatedProduct == null)
        {
            return BadRequest();
        }

        return Ok(updatedProduct);
    }


    [HttpPatch("removestock/{id:int}/{amount:int}")]
    [Produces("application/json")]
    public IActionResult RemoveStock([FromRoute] int id, [FromRoute] int amount)
    {
        var product = _repository.GetById(id);

        if (product == null)
        {
            return NotFound();
        }

        var updatedProduct = _repository.RemoveStock(product, amount);

        if (updatedProduct == null)
        {
            return BadRequest();
        }

        return Ok(updatedProduct);
    }


    
}
