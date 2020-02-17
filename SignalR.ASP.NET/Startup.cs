using Microsoft.Owin;
using Owin;
using System.Web.Http;

[assembly: OwinStartup(typeof(SignalR.ASP.NET.Startup))]

namespace SignalR.ASP.NET
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            config.Routes.MapHttpRoute("default", "api/{controller}/{id}", new { id = RouteParameter.Optional });

            ConfigureNinject(config);
            ConfigureSignalR(app);

            app.UseWebApi(config);
        }
    }
}
