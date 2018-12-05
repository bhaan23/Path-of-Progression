using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PathOfProgression.Models
{
	public class UpdateResponse
	{
		public List<int> updates { get; set; }
		public string lastCheckedTime { get; set; }
	}
}