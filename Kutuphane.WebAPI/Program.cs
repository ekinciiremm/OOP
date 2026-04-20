using Kutuphane.WebAPI.Services;
using Serilog;

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

// Baðýmlýlýklarý kaydet
builder.Services.AddSingleton<ILoggerService, LoggerManager>(sp => new LoggerManager(connectionString));
// IDbService'yi DbManager ile kaydet
builder.Services.AddScoped<IDbService, DbManager>(sp =>new DbManager(connectionString, sp.GetRequiredService<ILoggerService>()));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi


var app = builder.Build();

// Configure the HTTP request pipeline.



app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();

app.MapControllers();







app.Run();
