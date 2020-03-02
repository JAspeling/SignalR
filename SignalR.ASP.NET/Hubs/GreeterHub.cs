using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs.Interfaces.Client;
using SignalR.ASP.NET.Hubs.Interfaces.Server;

namespace SignalR.ASP.NET.Hubs
{
    public class GreeterHub: Hub<IClientGreeterHub>, IServerGreeterHub
    {
        public void Greet()
        {
            Clients.Others.Greet(Context.QueryString["name"]);
        }
    }
}