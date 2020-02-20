using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalR.ASP.NET.Hubs.Models.NotificationHub
{
    public class NotificationMessage
    {
        public NotificationMessage(string originatingUser, string message)
        {
            OriginatingUser = originatingUser;
            Message = message;
        }
        public string OriginatingUser { get; set; }
        public string Message { get; set; }
    }
}