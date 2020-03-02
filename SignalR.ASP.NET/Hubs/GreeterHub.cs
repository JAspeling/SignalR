using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs.Interfaces.Client;
using SignalR.ASP.NET.Hubs.Interfaces.Server;

namespace SignalR.ASP.NET.Hubs
{
    public class GreeterHub: Hub<IClientGreeterHub>, IServerGreeterHub
    {
        public void SendGreeting()
        {
            Clients.Others.Greet(Context.QueryString["name"]);
        }
    }
}