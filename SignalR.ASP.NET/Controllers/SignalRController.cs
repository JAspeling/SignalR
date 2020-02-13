using System.Web.Http;

namespace SignalR.ASP.NET.Controllers
{
    public class SignalRController : ApiController
    {
        [HttpGet]
        [ActionName("NotifyAll")]
        public string NotifyAll()
        {
            return "SignalR Notifaction Sent!";

        }
    }
}
