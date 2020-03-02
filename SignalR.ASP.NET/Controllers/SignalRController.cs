using System.Reflection;
using System.Runtime.CompilerServices;
using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs;
using System.Web.Http;
using Newtonsoft.Json;
using SignalR.ASP.NET.Hubs.Interfaces.Client;
using SignalR.ASP.NET.Hubs.Models;

namespace SignalR.ASP.NET.Controllers
{
    public class SignalRController : ApiController
    {
        private readonly IHubContext<IClientNotificationHub> notificationHub;
        private readonly IHubContext<IClientGreeterHub> greeterHub;

        public SignalRController(IHubContext<IClientNotificationHub> notificationHub,
            IHubContext<IClientGreeterHub> greeterHub)
        {
            this.notificationHub = notificationHub;
            this.greeterHub = greeterHub;
        }

        [HttpGet]
        [ActionName("NotifyAll")]
        public string NotifyAll(string message)
        {
            var method = MethodBase.GetCurrentMethod();
            var hubMessage = new HubMessage { Message = message, UserName = "Admin" };
            notificationHub.Clients.All.SendMessage(hubMessage);

            return $">> [SIGNALR] ({method}) - {JsonConvert.SerializeObject(hubMessage)}";
        }

        [HttpGet]
        [ActionName("Greet")]
        public IHttpActionResult Greet(string user)
        {

            this.greeterHub.Clients.All.Greet(user);

            return Ok($" >> [SIGNALR] Greeting sent out from {user}");
        }
    }
}
