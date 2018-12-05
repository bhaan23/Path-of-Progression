using System.Web.Mvc;
using System.Web.Routing;

namespace PathOfProgression
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			routes.MapRoute("Special home link", "home", new { controller = "Home", action = "Index" });
			routes.MapRoute("Page calls", "{action}", new { controller = "Home", action = "Index" });
			routes.MapRoute("API character call", "api/getCharacters", new { controller = "API", action = "GetCharacters" });
			routes.MapRoute("API calls", "api/getUpdates", new { controller = "API", action = "GetUpdates" });
			routes.MapRoute("Catch all", "*", new { controller = "Home", action = "Index" });
		}
	}
}
