using FluentAssertions;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Tests.Utilities
{
    public static class AssertionExtensions
    {
        public static async Task<T> ShouldDeserializeTo<T>(this HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<T>(content);
            result.Should().NotBeNull();
            return result;
        }

        public static async Task ShouldContainError(this HttpResponseMessage response, string expectedError)
        {
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain(expectedError);
        }
    }
}