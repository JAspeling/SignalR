using SignalR.ASP.NET.Hubs.Models;
using System.Threading.Tasks;

namespace SignalR.ASP.NET.Hubs.Interfaces
{
    public interface INotificationHub
    {
        // These are methods clients subscribe to on the front-end.
        Task Notify(string message);
        Task SendMessage(HubMessage message);
    }
}
