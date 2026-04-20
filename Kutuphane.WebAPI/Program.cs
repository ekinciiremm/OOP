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


// Program.cs içinde app.Run() satýrýnýn hemen üstüne ekle:

/*using (var scope = app.Services.CreateScope())
{
    var testLogger = scope.ServiceProvider.GetRequiredService<ILoggerService>();
    var testDb = scope.ServiceProvider.GetRequiredService<IDbService>();

    try
    {
        testLogger.LogInfo("Uygulama baþlatma testi: Servisler baþarýyla ayaða kalktý.");
        // Basit bir test sorgusu (Veritabaný baðlantýsýný denemek için)
        testDb.ExecuteReader("SELECT 1");
        testLogger.LogInfo("Veritabaný baðlantý testi baþarýlý!");
        Console.WriteLine(">>> TEST BAÞARILI: Servisler ve DB baðlandý! <<<");
    }
    catch (Exception ex)
    {
        Console.WriteLine($">>> TEST HATASI: {ex.Message} <<<");
        testLogger.LogError($"Baþlatma testi baþarýsýz: {ex.Message}");
    }
}*/


app.Run();
