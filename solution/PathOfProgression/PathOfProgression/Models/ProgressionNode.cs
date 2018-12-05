using System;

namespace PathOfProgression.Models
{
	public class ProgressionNode
	{
		public int id { get; set; }
		public string title { get; set; }
		public string action { get; set; }
		public string description { get; set; }
		public int[] nodesNeeded { get; set; }
		public bool completed { get; set; }
	}

	public class Action
	{
		
	}
}