document.addEventListener("DOMContentLoaded", (event) => { fetchData(); });
const getFormattedDate = (date) => { return   date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) };
function setMessage(text){ document.getElementById('message-id').innerText = text; }

function fetchData(){

    var time = new Date();
    document.getElementById('time-id').innerText = getFormattedDate(time);

    document.getElementById('refresh-button-id').addEventListener('click', (ev) => {
        location.reload();
    });

    document.getElementById('cover-id').addEventListener('click', (ev) => {
        hide = !hide;
        var listString = "";
        for (let i = 0; i < newNodes.length; i++) {
            const node = newNodes[i];
            node.style.display = hide ? "none" : "flex";
            const l = String(data.list[i]).substring(0,1);
            const d = lsStates[i] === true;
            if(d) listString += "<span>" + l + "</span>";
            else listString += l;
        }
        document.getElementById('cover-id').innerHTML = listString;
        document.getElementById('cover-id').style.opacity = hide ? "100%" : "0%";
        document.getElementById('refresh-button-id').style.display = hide ? "none" : "flex";
        document.getElementById('clear-ls-id').style.display = hide ? "none" : "flex";
    });

    document.getElementById('clear-ls-id').addEventListener('click', (ev) => {
        localStorage.clear();
        setMessage("Cleared localStorage");
        data = {
            title: "Example",
            list: [
                "Example Item 1",
                "Example Item 2"
            ]
        }
        init();
    });

    document.getElementById('file-uplaod-id').addEventListener('change', function(e) {
        if (e.target.files[0]) {
            data = parseJsonFile(e.target.files[0]).catch((err) => {
                setMessage("File Load Failed!");
            }).then((obj) => {
                var newName = e.target.files[0].name + " ~ " + (new Date()).toLocaleDateString('en-GB').toString();
                data = obj;
                data.title = newName;
                localStorage.setItem('jsonData', JSON.stringify(data));
                setMessage("Saved: " + newName);
                init();
            });
        }
    });

    if(localStorage.getItem('jsonData') === null){
        data = {
            title: "Example",
            list: [
                "Example Item 1",
                "Example Item 2"
            ]
        }
        setMessage(".json file not found")
    }else{
        var dataToLoad = JSON.parse(localStorage.getItem('jsonData'));
        data = dataToLoad;
        setMessage("found: " + data.title)
    }

    init();
}

var hide;
var data;
var lsStates = [];
var newNodes = [];

function init(){
    for (let i = 0; i < newNodes.length; i++) {
        const element = newNodes[i];
        element.remove();
    }
    lsStates = []; newNodes = [];

    const listItemSrc = document.getElementById('list-item-id');
    for (let i = 0; i < data.list.length; i++) {
        const itemText = data.list[i];
        lsStates.push(false);

        const newItemNode = listItemSrc.cloneNode(true);
        newItemNode.style.display = "flex";
        newItemNode.innerText = itemText;
        listItemSrc.parentNode.appendChild(newItemNode);
        newNodes.push(newItemNode);
        
        newItemNode.addEventListener('click', (ev) => {
            lsStates[i] = !lsStates[i];
            newItemNode.style.backgroundColor = lsStates[i] === true ? "lime" : "black";
            newItemNode.style.borderColor = lsStates[i] === true ? "lime" : "#333333";
            newItemNode.style.color = lsStates[i] === true ? "black" : "white";
        });
    }
}

async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = event => resolve(JSON.parse(event.target.result));
        fileReader.onerror = error => reject(error);
        fileReader.readAsText(file);
    });
}