using PathOfProgression.Models;
using System;
using System.Collections.Generic;
using System.IO;

namespace PathOfProgression.Util
{
	public class LogReaderService
	{
		private StreamReader logReader;
		private DateTime lastChecked;

		public LogReaderService() {
			this.lastChecked = DateTime.MinValue;
		}

		public LogReaderService(DateTime lastChecked)
		{
			this.lastChecked = lastChecked;
		}

		public string getLastChecked()
		{
			return lastChecked.ToString("yyyy/MM/dd HH:mm:ss");
		}
	
		public void OpenLogFile()
		{
			this.logReader = new StreamReader(new FileStream(Utils.logPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite));
		}

		public List<LogLine> GetUpdates(string characterName)
		{
			var newLastChecked = DateTime.Now;
			var updates = new List<LogLine>();
			string line;
			while ((line = this.logReader.ReadLine()) != null)
			{
				LogLine logLine;
				if ((logLine = LogLine.ParseLogLine(line, characterName)) != null)
				{
					if (logLine.timestamp >= this.lastChecked)
					{
						updates.Add(logLine);
					}
				}
			}
			this.lastChecked = newLastChecked;
			return updates;
		}
	}
}