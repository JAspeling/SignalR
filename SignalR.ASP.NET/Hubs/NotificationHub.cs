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
        public void SendNotification(string message)
        {
            // Call the notify method on all connected clients.
            Clients.All.Notify(message);
            Clients.All.SendMessage(new HubMessage());
        }

        public async Task SendMessage(string name, string message)
        {
            if (message.Contains("<script>"))
            {
                throw new HubException("This message will flow to the client",
                    new { user = Context.User.Identity.Name, message = message });
            }

            await Clients.All.SendMessage(new HubMessage() { UserName = name, Message = message });
        }

        public async Task NewMessage(string name, string message, string notification)
        {
            await Clients.Others.SendMessage(new HubMessage() { UserName = name, Message = message });
            await Clients.Caller.Notify(notification);
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
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            // Add your own code here.
            // For example: in a chat application, mark the user as offline, 
            // delete the association between the current connection id and user name.
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            // Add your own code here.
            // For example: in a chat application, you might have marked the
            // user as offline after a period of inactivity; in that case 
            // mark the user as online again.
            return base.OnReconnected();
        }

        private void LogInformation(string message = "", [CallerMemberName] string callingFunction = "")
        {
            string userName = (Clients.Caller as dynamic).UserName;
            string computerName = (Clients.Caller as dynamic).ComputerName;

            string _message = message == "" ? "" : $" - {message}";

            Trace.WriteLine($">> SIGNALR - [${computerName} - ${userName}] ({callingFunction}){message}");
        }
    }
}