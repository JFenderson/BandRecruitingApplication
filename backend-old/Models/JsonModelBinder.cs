using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json;

namespace server.Models
{
    public class JsonModelBinder : IModelBinder
    {
        public async Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var request = bindingContext.HttpContext.Request;
            if (!request.Body.CanRead)
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Cannot read request body");
                return;
            }

            try
            {
                using (var reader = new StreamReader(request.Body))
                {
                    var body = await reader.ReadToEndAsync();
                    var model = JsonSerializer.Deserialize(body, bindingContext.ModelType);
                    bindingContext.Result = ModelBindingResult.Success(model);
                }
            }
            catch (JsonException ex)
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"Invalid JSON: {ex.Message}");
            }
        }
    }
}
