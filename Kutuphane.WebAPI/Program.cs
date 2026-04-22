using Kutuphane.WebAPI.Repositories;
using Kutuphane.WebAPI.Services;
using Serilog;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);



var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.MSSqlServer(
        connectionString: connectionString,
        sinkOptions: new Serilog.Sinks.MSSqlServer.MSSqlServerSinkOptions
        {
            TableName = "Logs",
            AutoCreateSqlTable = true
        })
    .CreateLogger();

builder.Services.AddSwaggerGen();
builder.Host.UseSerilog();


builder.Services.AddSingleton<ILoggerService, LoggerManager>(sp => new LoggerManager(connectionString));
builder.Services.AddScoped<IDbService, DbManager>(sp =>new DbManager(connectionString, sp.GetRequiredService<ILoggerService>()));
builder.Services.AddScoped<IGenelBakisRepository, GenelBakisRepository>();
builder.Services.AddScoped<IKitapDuzenleRepository, KitapDuzenleRepository>();
builder.Services.AddScoped<IUyeRepository, UyeRepository>();
builder.Services.AddControllers();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(builder => {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
builder.Services.AddControllers().AddJsonOptions(options => {
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});


var app = builder.Build();



app.UseCors();



app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseDefaultFiles(); // index.html'i otomatik ana sayfa yapar
app.UseStaticFiles(); 

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();

app.MapControllers();







app.Run();
