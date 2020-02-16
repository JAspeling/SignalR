using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Owin;
using SignalR.ASP.NET.DependencyResolution;
using SignalR.ASP.NET.Hubs.ErrorHandling;
using SignalR.ASP.NET.Hubs.Modules;
using StructureMap;

namespace SignalR.ASP.NET
{
    public partial class Startup
    {
        public void ConfigureSignalR(IAppBuilder app)

        // TODO: Fix DI: https://stackoverflow.com/questions/20705937/how-do-you-resolve-signalr-v2-0-with-structuremap-v2-6
        {
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
            GlobalHost.HubPipeline.AddModule(new ErrorHandlingPipelineModule());
            GlobalHost.HubPipeline.AddModule(new LoggingPipelineModule());

            IContainer container = IoC.Initialize();
            
            container.AssertConfigurationIsValid();

            GlobalHost.DependencyResolver.Register(typeof(IHubActivator), () => new HubActivator(container));

            //GlobalHost.DependencyResolver.Register(
            //    typeof(IHubContext<INotificationHub>),
            //    () => GlobalHost.ConnectionManager.GetHubContext<NotificationHub, INotificationHub>());

            app.MapSignalR("/signalr", new HubConfiguration()
            {
                EnableDetailedErrors = true,
                EnableJavaScriptProxies = true
            });
        }
    }
}