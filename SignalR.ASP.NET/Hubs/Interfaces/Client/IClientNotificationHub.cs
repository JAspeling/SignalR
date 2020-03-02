using SignalR.ASP.NET.Hubs.Models;
using SignalR.ASP.NET.Hubs.Models.NotificationHub;

namespace SignalR.ASP.NET.Hubs.Interfaces.Client
{
    public interface IClientNotificationHub
    {
        // These are methods clients subscribe to on the front-end.
        void Notify(NotificationMessage notification);
        void SendMessage(HubMessage message);
    }
}
