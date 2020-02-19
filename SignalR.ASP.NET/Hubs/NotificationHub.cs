using System.Diagnostics;
using System.Runtime.CompilerServices;
using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs.Interfaces;
using System.Threading.Tasks;
using SignalR.ASP.NET.Hubs.Models;

namespace SignalR.ASP.NET.Hubs
{
    public class NotificationHub : Hub<INotificationHub>
    {
        // The SendNotification method can be called from a client.
        public async Task SendMessage(string message)
        {
            await Clients.All.SendMessage(new HubMessage() {UserName = Context.User.Identity.Name, Message = message});
        }

        public Task JoinGroup(string groupName)
        {
            return Groups.Add(Context.ConnectionId, groupName);
        }

        public Task LeaveGroup(string groupName)
        {
            return Groups.Remove(Context.ConnectionId, groupName);
        }

        // Lifetime events
        public override Task OnConnected()
        {
            // Add your own code here.
            // For example: in a chat application, record the association between
            // the current connection ID and user name, and mark the user as online.
            // After the code in this method completes, the client is informed that
            // the connection is established; for example, in a JavaScript client,
            // the start().done callback is executed.

            Clients.All.Notify($"{Context.ConnectionId} Connected");
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            // Add your own code here.
            // For example: in a chat application, mark the user as offline, 
            // delete the association between the current connection id and user name.

            Clients.All.Notify($"{Context.ConnectionId} Disconnected");
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            // Add your own code here.
            // For example: in a chat application, you might have marked the
            // user as offline after a period of inactivity; in that case 
            // mark the user as online again.

            Clients.All.Notify($"{Context.ConnectionId} Reconnected");
            return base.OnReconnected();
        }

        private void LogInformation(string message = "", [CallerMemberName] string callingFunction = "")
        {
            string userName = (Clients.Caller as dynamic).UserName;
            string computerName = (Clients.Caller as dynamic).ComputerName;

            string _message = message == "" ? "" : $" - {message}";

            Trace.WriteLine($">> SIGNALR - [${computerName} - ${userName}] ({callingFunction}){_message}");
        }
    }
}