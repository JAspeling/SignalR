using System.Collections.Generic;

namespace SignalR.ASP.NET.Hubs.Models
{
    public class HubMessage
    {
        public string UserName { get; set; }
        public string Message { get; set; }
        public List<string> Groups { get; set; }
    }
}