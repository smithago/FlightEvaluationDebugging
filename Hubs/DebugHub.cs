using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Debug_Evaluation.Model;
using Debug_Evaluation.Service;

namespace Debug_Evaluation.Hubs
{
    public class DebugHub : Hub
    {
        public async Task ConnectToGroup(string appid, string setting)
        {
            if(!string.IsNullOrWhiteSpace(appid) && !string.IsNullOrWhiteSpace(setting))
            {   
                await AddToGroup(Helper.GetGroupName(appid, setting));
            }
        }

        public async Task EnableVerbose(string appid, string setting)
        {
            if(!string.IsNullOrWhiteSpace(appid) && !string.IsNullOrWhiteSpace(setting))
            {
                Helper.EnableVerboseLogging(appid, setting);
            }
        }

        public async Task DisconnectFromGroup(string appid, string setting)
        {
            await RemoveFromGroup(Helper.GetGroupName(appid, setting));
        }

        private async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        private async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

    }
}