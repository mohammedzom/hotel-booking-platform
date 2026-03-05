using HotelBooking.Api;
using HotelBooking.Application;
using HotelBooking.Infrastructure;
using HotelBooking.Infrastructure.Data;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

ConfigureHostLogging(builder);
AddApplicationServices(builder);
AddHealthChecks(builder);



var app = builder.Build();

await ApplyMigrationsAndSeedAsync(app);



app.UseCoreMiddlewares();
app.MapControllers();
MapHealthEndpoints(app);

Log.Information("Starting Hotel Booking API...");
app.Run();

static void ConfigureHostLogging(WebApplicationBuilder builder)
{
    builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration));
}

static void AddApplicationServices(WebApplicationBuilder builder)
{
    builder.Services
        .AddPresentation(builder.Configuration)
        .AddApplication()
        .AddInfrastructure(builder.Configuration);
}

static void AddHealthChecks(WebApplicationBuilder builder)
{
    builder.Services.AddHealthChecks()
        .AddSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")!,
            name: "database",
            timeout: TimeSpan.FromSeconds(3));
}

static async Task ApplyMigrationsAndSeedAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var pendingMigrations = (await context.Database.GetPendingMigrationsAsync()).ToList();

    if (pendingMigrations.Count > 0)
    {
        app.Logger.LogWarning(
            "Applying {Count} pending migration(s): {Migrations}",
            pendingMigrations.Count,
            string.Join(", ", pendingMigrations));

        await context.Database.MigrateAsync();

        app.Logger.LogInformation("Database migrations applied successfully.");
    }
    else
    {
        app.Logger.LogInformation("Database is up to date — no pending migrations.");
    }

    if (app.Environment.IsDevelopment())
    {
        await DataSeeder.SeedAsync(app.Services);
    }
}
static void MapHealthEndpoints(WebApplication app)
{
    app.MapHealthChecks("/api/v1/health/live", new HealthCheckOptions
    {
        Predicate = _ => false,
        AllowCachingResponses = false
    }).AllowAnonymous();

    app.MapHealthChecks("/api/v1/health/ready", new HealthCheckOptions
    {

        Predicate = _ => true,
        AllowCachingResponses = false
    })
    .AllowAnonymous();
}

public partial class Program;