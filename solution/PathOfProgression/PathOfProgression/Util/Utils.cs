using System;
using System.Globalization;
using System.Xml;

namespace PathOfProgression.Util
{
	public class Utils
	{
		public static readonly string POESESSID;
		public static readonly string logPath;

		static Utils()
		{
			// Fuck c# and their files not being found.
			//XmlDocument xmlProperties = new XmlDocument();
			//xmlProperties.Load(@"InfoFiles/poeProperties.xml");
			//POESESSID = xmlProperties.SelectSingleNode("//POESESSID").InnerText;
			//logPath = xmlProperties.SelectSingleNode("//logPath").InnerText;
			POESESSID = "";
			logPath = @"C:/Program Files/Steam/steamapps/common/Path of Exile/logs/Client.txt";
		}

		public static DateTime ParseDateTime(string datetime)
		{
			return DateTime.ParseExact(datetime, "yyyy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);
		}
	}
}