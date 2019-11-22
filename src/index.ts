import "./css/main.css";
import * as signalR from "@aspnet/signalr";

//new code
interface settingEvalModel {
    appId: string;
    setting: string;
    value: string;
    randomizationUnit: randomizationUnit;
    constraint: Tuple[];
    context: Tuple[];
}

interface randomizationUnit {
    type: string;
    id: string;
    name: string;
}

interface Tuple {
    key: string;
    value: string;
}

const btnDebug: HTMLButtonElement = document.querySelector("#btnDebug");
const btnPause: HTMLButtonElement = document.querySelector("#btnPause");
const txtApp: HTMLInputElement = document.querySelector("#txtApp");
const txtSetting: HTMLInputElement = document.querySelector("#txtSetting");
const summary: HTMLDivElement = document.querySelector("#summary");
const verbose: HTMLDivElement = document.querySelector("#verbose-section");
const btnVerbose: HTMLButtonElement = document.querySelector("#btnVerbose");
const verbose_eval: HTMLDivElement = document.querySelector("#verbose-eval");

//init
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/debughub")
    .build();

btnDebug.addEventListener("click", connect);
btnPause.addEventListener("click", disconnect);
btnVerbose.addEventListener("click", verboseClicked);

enableDebug();
verbose.hidden = true;
let verboseEnabled: boolean = false;

function connect() {
    //connect to the hub group
    connection.start()
    .then(() => { 
        connection.send("connectToGroup", txtApp.value, txtSetting.value)
    })
    .catch(err => document.write(err));;

    //UI state change
    enablePause();
    reset();
}

let aggr: { [index: string]: number } = {};
connection.on("evalReceived", (model: settingEvalModel) => {
    //process the input for aggregation
    let k = model.value.toLowerCase();
    if(aggr.hasOwnProperty(k)) 
    {
        aggr[k] = aggr[k] + 1;
    }
    else
    {
        aggr[k] = 1;
    }
    //total count
    let totalEvaluation: number = 0;
    let evalTxt: string;
    for(var item in aggr)
    {
        totalEvaluation += aggr[item];
        let li = `<li>${aggr[item]} evaluations as ${item}</li>`;
        if(evalTxt === undefined)
        {
            evalTxt = li;
        }
        else
        {
            evalTxt = evalTxt + li;
        }
    }

    //get it ready for display
    summary.innerHTML =
    `<div style="flex-grow: 1">${txtSetting.value}</div style="flex-grow: 1">`+`<div> ${totalEvaluation} evaluations</div>`+`<div style="flex-grow: 4"><ul style="list-style-type:none">${evalTxt}</ul></div>`;

    //enable verbose
    verbose.hidden = false;

    //add verbose data
    if(verboseEnabled === true && model.randomizationUnit) 
    {
        let messageContainer = document.createElement("div");
        messageContainer.className = "list-row verbose-evaluation";
        let ctTxt: string ="<p>Change constrains</p>";
        if(model.constraint)
        {
            ctTxt += '<ul style="list-style-type:none">' + model.constraint.map(e => {
                return '<li>' + e.key + ': '+ e.value + '</li>';
            }).join('') + '</ul>';
        }
        let coTxt: string ="<p>Context</p>";
        if(model.context)
        {
            coTxt += '<ul style="list-style-type:none">' + model.context.map(e => {
                return '<li>' + e.key + ': '+ e.value + '</li>';
            }).join('') + '</ul>';
        }
        messageContainer.innerHTML = `<div> Evaluated for '${model.randomizationUnit.name} (${model.randomizationUnit.id})' as ${model.value} ''</div>`
        +`<div style="flex-grow: 2">${ctTxt}</div>`
        +`<div style="flex-grow: 2">${coTxt}</div>`;
        verbose_eval.appendChild(messageContainer);
    }
});


function reset() {
    aggr = {};
    summary.innerHTML = "";

    verbose.hidden = true;
    verboseEnabled = false;
    verbose_eval.innerHTML = "";

}

function disconnect() {
    connection.stop();
    enableDebug();
}

function enableDebug() {
    btnDebug.disabled = false;
    btnPause.disabled = true;
}

function enablePause() {
    btnDebug.disabled = true;
    btnPause.disabled = false;
}

function verboseClicked() {
    verboseEnabled = true;
    connection.send("enableVerbose", txtApp.value, txtSetting.value);
}