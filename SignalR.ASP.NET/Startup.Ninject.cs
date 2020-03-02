using Microsoft.AspNet.SignalR;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.WebApi.Filter;
using SignalR.ASP.NET.App_Start;
using SignalR.ASP.NET.Hubs;
using SignalR.ASP.NET.Hubs.Interfaces.Client;
using System;
using System.Web;
using System.Web.Http;

namespace SignalR.ASP.NET
{
    public partial class Startup
    {
        public void ConfigureNinject(HttpConfiguration config)
        {
            config.DependencyResolver = new NinjectResolver(CreateKernel());
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();
                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<DefaultFilterProviders>()
                .ToConstant(
                    new DefaultFilterProviders(GlobalConfiguration.Configuration.Services.GetFilterProviders()));
            kernel.Bind<DefaultModelValidatorProviders>().ToConstant(
                new DefaultModelValidatorProviders(
                    GlobalConfiguration.Configuration.Services.GetModelValidatorProviders()));

            kernel.Bind<IHubContext<IClientNotificationHub>>().ToMethod(x =>
                GlobalHost.ConnectionManager.GetHubContext<NotificationHub, IClientNotificationHub>());

            kernel.Bind<IHubContext<IClientGreeterHub>>().ToMethod(x =>
                GlobalHost.ConnectionManager.GetHubContext<GreeterHub, IClientGreeterHub>());
        }
    }
}