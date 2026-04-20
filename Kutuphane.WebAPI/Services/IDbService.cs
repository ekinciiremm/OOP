using Microsoft.Data.SqlClient;

namespace Kutuphane.WebAPI.Services
{
    public interface IDbService
    {
        void ExecuteCommand(string query, List<SqlParameter> parameters);
        SqlDataReader ExecuteReader(string query, List<SqlParameter> parameters = null);
    }
}
