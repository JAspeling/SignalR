using SignalR.ASP.NET.Hubs.Models;
using System.Threading.Tasks;

namespace SignalR.ASP.NET.Hubs.Interfaces
{
    public interface INotificationHub
    {
        Task Notify(string message);
        Task SendMessage(HubMessage message);
    }
}
