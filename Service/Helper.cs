using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;

namespace Debug_Evaluation.Service {
    public class Helper
    {
        public static string GetGroupName(string appid, string setting)
        {
            if(!string.IsNullOrWhiteSpace(appid) && !string.IsNullOrWhiteSpace(setting))
            {
                return string.Format(
                CultureInfo.InvariantCulture,
                "{0}_{1}",
                appid,
                setting
                ).ToLower();
            };
            return null;
        }

        public static void EnableVerboseLogging(string appId, string setting)
        {
            s_verboseSetting[GetGroupName(appId, setting)] = DateTime.Now;
        }

        public static bool IsVerboseLoggingEnabled(string appId, string setting)
        {
            string key = GetGroupName(appId, setting);
            return (s_verboseSetting.ContainsKey(key) && s_verboseSetting[key].AddMinutes(5) > DateTime.Now);
        }

        public static Dictionary<string, DateTime> s_verboseSetting = new Dictionary<string, DateTime>();
    }
}