using System.Threading.Tasks;
using SignalR.ASP.NET.Hubs.Models;

namespace SignalR.ASP.NET.Hubs.Interfaces
{
    public interface INotificationHub
    {
        //string UserName { get; set; }
        //string ComputerName { get; set; }

        Task Notify(string message);
        Task SendMessage(HubMessage message);
    }
}
