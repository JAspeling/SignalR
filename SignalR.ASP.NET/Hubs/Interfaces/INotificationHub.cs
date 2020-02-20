using SignalR.ASP.NET.Hubs.Models;
using System.Threading.Tasks;
using SignalR.ASP.NET.Hubs.Models.NotificationHub;

namespace SignalR.ASP.NET.Hubs.Interfaces
{
    public interface INotificationHub
    {
        // These are methods clients subscribe to on the front-end.
        void Notify(NotificationMessage notification);
        void SendMessage(HubMessage message);
    }
}
