using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using Owin;
using SignalR.ASP.NET.Hubs.ErrorHandling;
using SignalR.ASP.NET.Hubs.Modules;

namespace SignalR.ASP.NET
{
    public partial class Startup
    {
        public void ConfigureSignalR(IAppBuilder app)
        {
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
            GlobalHost.HubPipeline.AddModule(new ErrorHandlingPipelineModule());
            GlobalHost.HubPipeline.AddModule(new LoggingPipelineModule());

            app.MapSignalR("/signalr", new HubConfiguration()
            {
                EnableDetailedErrors = true,
                EnableJavaScriptProxies = true, 
                EnableJSONP = true
            });
        }
    }
}