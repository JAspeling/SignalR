using Microsoft.AspNet.SignalR;

namespace SignalR.ASP.NET.Hubs
{
    public class NotificationHub : Hub
    {

        public NotificationHub()
        {
                
        }

        public void SendNotification(string message)
        {
            // Call the notification method on all connected clients.
            Clients.All.notification(message);
        }
    }
}