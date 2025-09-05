using Xunit;

namespace Backend.Tests;

[CollectionDefinition("IntegrationTests")]
public class IntegrationTestCollection : ICollectionFixture<TestServerFixture>
{
}
