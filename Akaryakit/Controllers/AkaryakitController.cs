using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Akaryakit.Models;
namespace Akaryakit.Controllers
{
    //db.AkaryakitIStasyonlari.aggregate([{$match:{Il:"Bursa"}},{$group:{_id:"$Il", adet:{$sum:"$1"}}}])
    public class AkaryakitController : ApiController
    {
        MongoClient client = new MongoClient();
        [HttpPost]
        public async Task<List<markerIl>> ComboSehirDoldur(marker Il)
        {
            var db = client.GetDatabase("Sehirler");
            var collection = db.GetCollection<BsonDocument>("AkaryakitIStasyonlari");
            //var filter = Builders<BsonDocument>.Filter.Ne("Il", "");
            var output = new List<markerIl>();
            //var result = collection.Find(filter).ToList();
            var aggregate = collection.Aggregate()
                                        .Group(new BsonDocument { { "_id", "$Il" }, { "count", new BsonDocument("$sum", 1) } })
                                        .Sort(new BsonDocument { { "count", -1 } });
            var results = await aggregate.ToListAsync();
            if (results.Count > 0)
            {
                foreach (var item in results)
                {
                    var gelen = new markerIl()
                    {
                        Il = item["_id"].AsString,
                        count = item["count"].AsInt32
                    };
                    output.Add(gelen);
                }
            }

            return output;


        }
        [HttpPost]
        public async Task<List<MarkerOutput>> Goster(marker Il)
        {
            var output = new List<MarkerOutput>();
            var db = client.GetDatabase("Sehirler");
            var collection = db.GetCollection<BsonDocument>("AkaryakitIStasyonlari");
            var filter = Builders<BsonDocument>.Filter.Eq("Il", Il.Il);
            //var result = collection.Find(filter).FirstOrDefault();
            var result = collection.Find(filter).ToList();
            if (result.Count > 0)
            {
                foreach (var item in result)
                {
                    var gelen = new MarkerOutput()
                    {
                        Geo = new GeoPointBs()
                        {
                            type = item["Geo"]["type"].AsString,
                            coordinates = item["Geo"]["coordinates"].AsBsonArray
                        },
                        Il = item["Il"].AsString,
                        Ad = item["Ad"].AsString

                    };
                    output.Add(gelen);
                }
            }

            return output;
        }
        [HttpPost]
        public async Task<List<sehirOutput>> GosterSehir(sehirler Il)
        {
            var output = new List<sehirOutput>();
            var db = client.GetDatabase("Sehirler");
            var collection = db.GetCollection<BsonDocument>("Iller");
            var filter = Builders<BsonDocument>.Filter.Eq("IlAdi", Il.Il);
            //var result = collection.Find(filter).FirstOrDefault();
            var result = collection.Find(filter).ToList();
            if (result.Count > 0)
            {
                foreach (var item in result)
                {
                    var gelen = new sehirOutput()
                    {
                        Geo = new GeoPointBs()
                        {
                            type = item["Geo"]["type"].AsString,
                            coordinates = item["Geo"]["coordinates"].AsBsonArray
                        },
                        Il = item["IlAdi"].AsString

                    };
                    output.Add(gelen);
                }
            }

            return output;
        }
        [HttpPost]
        public async Task<List<ilceOutput>> GosterIlce(Ilceler IlAdi)
        {
            var output = new List<ilceOutput>();
            var db = client.GetDatabase("Sehirler");
            var collection = db.GetCollection<BsonDocument>("Ilceler");
            var filter = Builders<BsonDocument>.Filter.Eq("IlAdi", IlAdi.IlAdi);
            var result = collection.Find(filter).ToList();
            if (result.Count > 0)
            {
                foreach (var item in result)
                {
                    var gelen = new ilceOutput()
                    {
                        Geo = new GeoPointBs()
                        {
                            type = item["Geo"]["type"].AsString,
                            coordinates = item["Geo"]["coordinates"].AsBsonArray
                        },
                        IlceAdi = item["IlceAdi"].AsString,
                        IlAdi = item["IlAdi"].AsString

                    };
                    output.Add(gelen);
                }
            }

            return output;
        }
    }

}
