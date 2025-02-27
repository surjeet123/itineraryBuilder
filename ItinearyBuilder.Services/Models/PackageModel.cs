using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ItinearyBuilder.Business.Models
{
    public class DestinationOverview
    {
        public string destination { get; set; }
        public string country { get; set; }
        public string description { get; set; }
        public int annualvisitors { get; set; }
        public string[] besttimetovisit { get; set; }
    }
    public class HotelInfo
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public int StarRating { get; set; }
        public decimal PricePerNight { get; set; }
        public string[] Amenities { get; set; }
    }
    public class RestaurantInfo
    {
        public string Name { get; set; }
        public string Cuisine { get; set; }
        public string Location { get; set; }
        public double Rating { get; set; }
    }
    public class TravellerInputModel
    {
        public string Destination { get; set; }
        public string BoardingFrom { get; set; }
        public string TravelDuration { get; set; }
        public string TravellingWith { get; set; }
    }
}
