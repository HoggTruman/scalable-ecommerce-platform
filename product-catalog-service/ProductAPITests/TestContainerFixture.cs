using Testcontainers.PostgreSql;

namespace ProductAPITests;

public class TestContainerFixture : IAsyncLifetime
{
    public readonly PostgreSqlContainer postgres = new PostgreSqlBuilder()
        .WithImage("postgres:17.2")
        .Build();


    public Task InitializeAsync()
    {
        return postgres.StartAsync();
    }

    public Task DisposeAsync()
    {
        return postgres.DisposeAsync().AsTask();
    }

    
}
