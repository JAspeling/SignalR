using System.Reflection;
using System.Runtime.CompilerServices;
using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs;
using System.Web.Http;
using Newtonsoft.Json;
using SignalR.ASP.NET.Hubs.Interfaces;
using SignalR.ASP.NET.Hubs.Models;

namespace SignalR.ASP.NET.Controllers
{
    public class SignalRController : ApiController
    {
        private readonly IHubContext<INotificationHub> _notificationHub;

        public SignalRController(IHubContext<INotificationHub> notificationHub)
        {
            _notificationHub = notificationHub;
        }
        static IHubContext<INotificationHub> NotificationHubContext =>
            GlobalHost.ConnectionManager.GetHubContext<NotificationHub, INotificationHub>();

        [HttpGet]
        [ActionName("NotifyAll")]
        public string NotifyAll(string message)
        {
            var method = MethodBase.GetCurrentMethod();
            var hubMessage = new HubMessage { Message = message, UserName = "Admin" };
            _notificationHub.Clients.All.SendMessage(hubMessage);

            return $">> [SIGNALR] ({method}) - {JsonConvert.SerializeObject(hubMessage)}";
        }
    }
}
