namespace SignalR.ASP.NET.Hubs.Interfaces.Client.Server
{
    public interface IServerNotificationHub
    {
        void SendMessage(string message);
        void SendGroupMessage(string group, string message);
        void SendGroupsMessage(string[] groups, string message);
        void JoinGroup(string groupName);
        void LeaveGroup(string groupName);
    }
}
