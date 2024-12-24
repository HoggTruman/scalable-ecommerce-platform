using dotenv.net;
using Microsoft.EntityFrameworkCore;
using ProductAPI.Data;
using ProductAPI.Repositories;


DotEnv.Load();


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContextPool<ApplicationDbContext>(options => {
    var port = Environment.GetEnvironmentVariable("POSTGRES_PORT");
    var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
    var db = Environment.GetEnvironmentVariable("POSTGRES_DATABASE");

    options.UseNpgsql($@"Server=localhost;Port={port};Username=postgres;Password={password};Database={db};",
        options => options
            .SetPostgresVersion(17, 2)            
    );
});


builder.Services.AddScoped<ProductRepository>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
