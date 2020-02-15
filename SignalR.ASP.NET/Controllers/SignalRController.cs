using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs;
using System.Web.Http;

namespace SignalR.ASP.NET.Controllers
{
    public class SignalRController : ApiController
    {

        public SignalRController(IHubContext<NotificationHub> hubcontext)
        {


        }

        [HttpGet]
        [ActionName("NotifyAll")]
        public string NotifyAll(string message)
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            hubContext.Clients.All.notification(message);

            return "SignalR Notifaction Sent!";
        }
    }
}
