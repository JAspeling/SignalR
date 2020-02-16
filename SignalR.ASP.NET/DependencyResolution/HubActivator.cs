using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR.Hubs;
using StructureMap;

namespace SignalR.ASP.NET.DependencyResolution
{
    public class HubActivator : IHubActivator
    {
        private readonly IContainer container;

        public HubActivator(IContainer container)
        {
            this.container = container;
        }

        public IHub Create(HubDescriptor descriptor)
        {
            return (IHub)container.GetInstance(descriptor.HubType);
        }
    }
}