using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOPDeneme.DbManager
{
    public interface IDbServis
    {
        void ExecuteCommand(string query, List<SqlParameter> parameters);
        SqlDataReader ExecuteReader(string query, List<SqlParameter> parameters = null);
    }
}
