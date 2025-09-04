using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using server.DTOs;
using server.Exceptions;
using System.Text.Json;

namespace server.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = ApiResponse<string>.ErrorResponse(
                GetErrorMessage(exception)
            );

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = GetStatusCode(exception);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }

        private static string GetErrorMessage(Exception exception)
        {
            return exception switch
            {
                NotFoundException => exception.Message,
                UnauthorizedAccessException => "Unauthorized access",
                ArgumentException => exception.Message,
                _ => "An internal server error occurred"
            };
        }

        private static int GetStatusCode(Exception exception)
        {
            return exception switch
            {
                NotFoundException => 404,
                UnauthorizedAccessException => 401,
                ArgumentException => 400,
                _ => 500
            };
        }
    }
}