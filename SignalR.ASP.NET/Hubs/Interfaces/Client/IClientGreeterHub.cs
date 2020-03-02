using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalR.ASP.NET.Hubs.Interfaces.Client
{
    public interface IClientGreeterHub
    {
        void Greet(string user);
    }
}
