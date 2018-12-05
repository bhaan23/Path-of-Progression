using System;
using System.Globalization;
using System.Text.RegularExpressions;
using PathOfProgression.Enums;
using PathOfProgression.Util;

namespace PathOfProgression.Models
{

	public class LogLine
	{
		public DateTime timestamp { get; }
		public LogType logType { get; }
		public string message { get; }

		private LogLine(DateTime timestamp, LogType logType, string message)
		{
			this.timestamp = timestamp;
			this.logType = logType;
			this.message = message;
		}

		public static LogLine ParseLogLine(string line, string characterName)
		{
			// TODO: Move these out of here and into a map of LogType => Regex expressions so we can loop
			string enteredRegex = @"(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}).*?\[INFO Client \d+\] : (You have entered (.+)\.)";
			string levelRegex = @"(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}).*?\[INFO Client \d+\] : (" + characterName + @" \(\w+\) is now level (\d+))";

			if (Regex.IsMatch(line, enteredRegex))
			{
				var lineMatch = Regex.Match(line, enteredRegex);
				var timestamp = Utils.ParseDateTime(lineMatch.Groups[1].Value);
				var message = lineMatch.Groups[3].Value;
				return new LogLine(timestamp, LogType.ENTERED_LOCATION, message);
			}
			else if (Regex.IsMatch(line, levelRegex))
			{
				var lineMatch = Regex.Match(line, levelRegex);
				var timestamp = Utils.ParseDateTime(lineMatch.Groups[1].Value);
				var message = lineMatch.Groups[4].Value;
				return new LogLine(timestamp, LogType.LEVEL_UP, message);
			}
			return null;
		}
	}
}