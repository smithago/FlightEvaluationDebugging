using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Debug_Evaluation.Model;
using Debug_Evaluation.Hubs;
using Debug_Evaluation.Service;

namespace Debug_Evaluation.Controller
{
    [ApiController]
    [Route("[controller]")]
    public class SettingEvalController : ControllerBase
    {
        public SettingEvalController(IHubContext<DebugHub> hubContext)
        {
            m_hubContext = hubContext;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Create(SettingEvalModel eval)
        {
            await this.NotifyNewEvaluation(eval);
            return new HttpResponseMessage(HttpStatusCode.Created);
        }

        public async Task NotifyNewEvaluation(SettingEvalModel model)
        {
            var groupName = Helper.GetGroupName(model.AppId, model.Setting);
            await m_hubContext.Clients.Group(groupName).SendAsync("evalReceived", model);
        }
        
        private IHubContext<DebugHub> m_hubContext;

    }
}