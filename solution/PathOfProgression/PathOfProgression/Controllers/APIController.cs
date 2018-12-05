using Newtonsoft.Json;
using PathOfProgression.Enums;
using PathOfProgression.Models;
using PathOfProgression.Util;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;

namespace PathOfProgression.Controllers
{
	public class APIController : Controller
	{
		private static readonly HttpClient client;

		static APIController()
		{
			client = new HttpClient();
		}

		[HttpPost]
		public JsonResult GetCharacters(string accountName)
		{
			var url = @"http://www.pathofexile.com/character-window/get-characters?" +
							string.Format("accountName={0}", WebUtility.UrlEncode(accountName));
			
			var request = WebRequest.Create(url);
			request.Method = "GET";
			request.ContentType = "application/json; charset=utf-8";

			var response = request.GetResponse();
			string responseJsonString;
			using (var sr = new StreamReader(response.GetResponseStream()))
			{
				responseJsonString = sr.ReadToEnd();
			}

			var characters = JsonConvert.DeserializeObject<Character[]>(responseJsonString);
			var names = new List<string>();
			string lastPlayedName = null;
			foreach (Character character in characters)
			{
				if (character.lastActive)
				{
					lastPlayedName = character.name;
				}
				else
				{
					names.Add(character.name);
				}
			}
			// Add the last active character to the top of the results
			if (lastPlayedName != null)
			{
				names.Insert(0, lastPlayedName);
			}

			var jsonResult = new JsonResult()
			{
				Data = new { names },
				ContentType = "json"
			};

			return jsonResult;
		}

		[HttpPost]
		public ActionResult GetUpdates(string characterName, string progressionNodes, string lastTimestamp)
		{
			// Here until I finish being lazy and change the structure of the data being passed in.
			var locationNodes = new List<ProgressionNode>();
			var levelNodes = new List<ProgressionNode>();
			var parsedProgressionNodes = JsonConvert.DeserializeObject<ProgressionNode[]>(progressionNodes);
			foreach (ProgressionNode progressionNode in parsedProgressionNodes)
			{
				if (progressionNode.action.Contains("[enter]"))
				{
					locationNodes.Add(progressionNode);
				}
				else if (progressionNode.action.Contains("[level]"))
				{
					levelNodes.Add(progressionNode);
				}
			}

			LogReaderService service = string.IsNullOrEmpty(lastTimestamp) ? new LogReaderService() : new LogReaderService(Utils.ParseDateTime(lastTimestamp));

			service.OpenLogFile();
			var progressionUpdates = new SortedSet<int>();
			foreach (LogLine update in service.GetUpdates(characterName))
			{
				
				switch (update.logType)
				{
					case LogType.ENTERED_LOCATION:
						foreach (ProgressionNode node in locationNodes)
						{
							if (node.action.Replace("[enter] ", "").Equals(update.message))
							{
								progressionUpdates.Add(node.id);
								break;
							}
						}
						break;
					case LogType.LEVEL_UP:
						foreach (ProgressionNode node in levelNodes)
						{
							if (node.action.Replace("[level] ", "").Equals(update.message))
							{
								progressionUpdates.Add(node.id);
								break;
							}
						}
						break;
				}
			}
			
			return new JsonResult()
			{
				Data = new UpdateResponse()
				{
					updates = progressionUpdates.ToList<int>(),
					lastCheckedTime = service.getLastChecked()
				},
				ContentType = "json"
			};
		}
	}
}