using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SignalR.ASP.NET.Hubs;
using SignalR.ASP.NET.Hubs.Interfaces;
using StructureMap;

namespace SignalR.ASP.NET.DependencyResolution
{
    public class HubRegistry : Registry
    {
        public HubRegistry()
        {
            this.For<IHubContext<INotificationHub>>()
                .Use(() => GlobalHost.ConnectionManager.GetHubContext<NotificationHub, INotificationHub>());
        }
    }
}