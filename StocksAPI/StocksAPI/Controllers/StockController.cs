using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StocksAPI.models;

namespace StocksAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private async Task<List<StockValue>> getStockValuesAsync()
        {
            StreamReader r = new StreamReader("Stock Values.json");
            string jsonString = r.ReadToEnd();
            List<StockValue> stocks = JsonConvert.DeserializeObject<List<StockValue>>(jsonString);
            return stocks;

        }

        private async Task<List<Stock>> getStockAsync()
        {
            StreamReader r = new StreamReader("Stocks.json");
            string jsonString = r.ReadToEnd();
            List<Stock> stocks = JsonConvert.DeserializeObject<List<Stock>>(jsonString);
            return stocks;

        }

        [HttpGet("")]
        public async Task<List<Stock>> getStockListAsync()
        {
            var stocks = await getStockAsync();

            if (stocks == null)
            {
                return null;
            }

            return stocks;
        }


        [HttpGet("{id}")]
        public async Task<List<StockValue>> getStockValueListAsync(int id)
        {
            List<StockValue> stocks = await getStockValuesAsync();

            List<StockValue> seacrchedStockList = stocks.Where(x => x.stock_id == id).ToList();
            return seacrchedStockList;
        }

    }
}
