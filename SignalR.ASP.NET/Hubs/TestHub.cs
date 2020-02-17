using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalR.ASP.NET.Hubs
{
    public class TestHub : ITestHub
    {
        public string Name { get; set; }
    }

    public interface ITestHub
    {
        string Name { get; set; }
    }
}