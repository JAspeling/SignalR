using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs.Interfaces;
using System.Threading.Tasks;
using SignalR.ASP.NET.Hubs.Models;
using SignalR.ASP.NET.Hubs.Models.NotificationHub;

namespace SignalR.ASP.NET.Hubs
{
    public class NotificationHub : Hub<INotificationHub>
    {
        // The SendNotification method can be called from a client.
        public void SendMessage(string message)
        {
            Clients.AllExcept(Context.ConnectionId).SendMessage(new HubMessage()
            {
                UserName = Context.QueryString["name"],
                Message = message
            });
        }

        public void SendGroupMessage(string group, string message)
        {
            Clients.OthersInGroup(group).SendMessage(new HubMessage
            {
                Message = message,
                UserName = Context.QueryString["name"],
                Groups = new List<string>() {group}
            });
        }

        public void SendGroupsMessage(string[] groups, string message)
        {
            Clients.OthersInGroups(groups).SendMessage(new HubMessage
            {
                Message = message,
                UserName = Context.QueryString["name"],
                Groups = new List<string>(groups)
            });
        }

        public void JoinGroup(string groupName)
        {
            Clients.OthersInGroup(groupName).Notify(new NotificationMessage(Context.QueryString["name"], $"joined {groupName}"));

            Groups.Add(Context.ConnectionId, groupName);
        }

        public void LeaveGroup(string groupName)
        {
            Clients.OthersInGroup(groupName).Notify(new NotificationMessage(Context.QueryString["name"], $"left {groupName}"));

            Groups.Remove(Context.ConnectionId, groupName);
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

            Clients.All.Notify(new NotificationMessage(Context.QueryString["name"], "Connected"));
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            // Add your own code here.
            // For example: in a chat application, mark the user as offline, 
            // delete the association between the current connection id and user name.

            Clients.All.Notify(new NotificationMessage(Context.QueryString["name"], "Disconnected"));
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            // Add your own code here.
            // For example: in a chat application, you might have marked the
            // user as offline after a period of inactivity; in that case 
            // mark the user as online again.

            Clients.All.Notify(new NotificationMessage(Context.QueryString["name"], "Reconnected"));
            return base.OnReconnected();
        }

        private void LogInformation(string message = "", [CallerMemberName] string callingFunction = "")
        {
            string userName = Context.QueryString["name"];
            string computerName = Context.QueryString["computer"];

            string _message = message == "" ? "" : $" - {message}";

            Trace.WriteLine($">> SIGNALR - [${computerName} - ${userName}] ({callingFunction}){_message}");
        }
    }
}