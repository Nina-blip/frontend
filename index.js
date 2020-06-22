"use strict";

const filialenUrl = "http://localhost:8008/filialen";

leesFilialen();

async function leesFilialen() {
    const response = await fetch(filialenUrl);
    if (response.ok) {
        const filialen = await response.json();
        maakHyperlinksMet(filialen);
    } else {
        technischeFout();
    }
}

function maakHyperlinksMet(filialen) {
    const ul = document.getElementById("filialen");
    for (const filiaal of filialen._embedded.filiaalIdNaamList) {
        const li = maakLiMet(filiaal.naam, filiaal._links.self.href);
        ul.appendChild(li);
    }
}

function maakLiMet(naam, url) {
    const li = document.createElement("li");
    const hyperlink = document.createElement("a");
    hyperlink.innerText = naam;
    hyperlink.href = "#";
    hyperlink.dataset.url = url;
    hyperlink.onclick = function () {
        leesFiliaalMetUrl(this.dataset.url);
    }
    li.appendChild(hyperlink);
    return li;
}

function technischeFout() {
    document.getElementById("technischeFout").style.display = "block";
}

async function leesFiliaalMetUrl(url) {
    const response = await fetch(url);
    if (response.ok) {
        const filiaal = await response.json();
        toonDetailVan(filiaal);
    } else {
        technischeFout();
    }
}

function toonDetailVan(filiaal) {
    document.getElementById("id").innerText = filiaal.id;
    document.getElementById("naam").innerText = filiaal.naam;
    document.getElementById("gemeente").innerText = filiaal.gemeente;
    document.getElementById("omzet").innerText = filiaal.omzet;
}

document.getElementById("toevoegen").onclick = toevoegen;

async function toevoegen() {
    const verkeerdeElementen = document.querySelectorAll("input:invalid");
    for (const element of verkeerdeElementen) {
        document.getElementById(`${element.id}Fout`).style.display = "inline";
    }

    const correcteElementen = document.querySelectorAll("input:valid");
    for (const element of correcteElementen) {
        document.getElementById(`${element.id}Fout`).style.display = "";
    }

    if (verkeerdeElementen.length === 0) {
        const filiaal = {
            naam: document.getElementById("nieuweNaam").value,
            gemeente: document.getElementById("nieuweGemeente").value,
            omzet: document.getElementById("nieuweOmzet").value
        };
        const response = await fetch(filialenUrl, {
            method: "post",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(filiaal)
        });
        if (response.ok) {
            const ul = document.getElementById("filialen");
            const li = maakLiMet(filiaal.naam, response.headers.get("location"));
            ul.appendChild(li);
            document.getElementById("technischeFout").style.display = "none";
        } else {
            technischeFout();
        }
    }
}