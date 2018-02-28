using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Akaryakit.Models
{
    public class GeoPointArr
    {
        public string type { get; set; }
        public double[][][][] coordinates { get; set; }
    }
    public class GeoPointBs
    {
        public string type { get; set; }
        public BsonArray coordinates { get; set; }
    }
    public class marker
    {
        public GeoPointBs Geo { get; set; }
        public string Ad { get; set; }
        public string Il { get; set; }
        public string Ilce { get; set; }
        public string PostaKodu { get; set; }
    }
    public class MarkerOutput
    {
        public GeoPointBs Geo { get; set; }
        public string Ad { get; set; }
        public string Il { get; set; }
        public string Ilce { get; set; }
        public string PostaKodu { get; set; }
    }
    public class markerIl
    {
        public Int32 count { get; set; }
        public string Il { get; set; }
    }
    public class sehirler
    {
        public string Il { get; set; }
    }
    public class sehirOutput
    {
        public GeoPointBs Geo { get; set; }
        public string Il { get; set; }
    }
    public class ilceOutput
    {
        public GeoPointBs Geo{ get; set; }
        public string IlAdi { get; set; }
        public string IlceAdi { get; set; }
    }
    public class Ilceler
    {
        public string IlAdi { get; set; }
    }
}