import { SHEET_ID } from "./config.js";
import { loadSheet } from "./modules/sheets.js";
import { clean, linkify } from "./modules/utils.js";

console.log("SHEET_ID:", SHEET_ID);

const sheet=name=>
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`

const urls={
resumen:sheet("Resumen"),
imp1:sheet("IMP_Pedido 1 y 2"),
imp2:sheet("IMP_Adicionales"),
imp3:sheet("IMP_Vivvidecor"),
imp4:sheet("IMP_Reprocesos carpinteria")
}

let resumen=[]
let imp1=[]
let imp2=[]
let imp3=[]
let imp4=[]

async function init(){

  try{
  
  console.log("INIT START")
  
  resumen = await load(urls.resumen)
  imp1 = await load(urls.imp1)
  imp2 = await load(urls.imp2)
  imp3 = await load(urls.imp3)
  imp4 = await load(urls.imp4)
  
  }catch(e){
  
  console.error("INIT ERROR", e)
  
  }
  
  document.getElementById("loading").style.display="none"
  
  console.log("INIT END")
  
  }

async function load(url){

  try{
  
  console.log("loading", url)
  
  const data = await loadSheet(url)
  
  console.log("loaded", data.length)
  
  return data.slice(1)
  
  }catch(e){
  
  console.error("Error loading", url, e)
  
  return []
  
  }
  
  }

  const search = document.getElementById("search");

  if(search){
  search.addEventListener("input",e=>{
  const code=clean(e.target.value)
  if(code.length>2)buscar(code)
  })
  }

function buscar(code){

const dash=document.getElementById("dashboard")
dash.innerHTML=""
dash.style.display="none"

const row=resumen.find(r=>clean(r[0])===code)

if(!row)return

dash.style.display="grid"

dash.innerHTML=`

${card("Datos Proyecto",
["Coordinador","Residente","Proyecto","Contratista","Tipo proyecto"],
row.slice(1,6))}

${card("Diseño",
["Padlet","Ppto aprobado","Ppto decor","Renders","Planos obra","Planos muebles"],
row.slice(6,12),true)}

${card("Entrega",
["Entrega inicial","Entrega final"],
row.slice(12,14))}

${card("Carpintería",
["Estado","Tipo","Instalador","Meta rectificación","Real rectificación","Link rectificación","Estado rectificación","Despacho real","Ingreso real","Fin real"],
row.slice(14,24),true)}

${impPedido(code)}
${impAdicional(code)}
${impVivvidecor(code)}
${impReprocesos(code)}

`
}

function card(t,l,v,links=false){
let h=`<div class="card"><h3>${t}</h3>`
l.forEach((x,i)=>{
h+=`
<div class="item">
<div class="label">${x}</div>
<div>${links?linkify(v[i]):(v[i]||"")}</div>
</div>`
})
return h+"</div>"
}

function impPedido(code){
const data=imp1.filter(r=>clean(r[2])===code)
if(!data.length)return ""
let rows=""
data.forEach(r=>{
rows+=`
<tr>
<td>${r[0]||""}</td>
<td>${r[16]||""}</td>
<td>${r[17]||""}</td>
<td>${r[18]||""}</td>
<td>${r[19]||""}</td>
<td>${r[21]||""}</td>
<td>${r[22]||""}</td>
</tr>`
})
return`
<div class="card full">
<h3>IMP Pedido 1 y 2</h3>
<table class="table">
<tbody>${rows}</tbody>
</table>
</div>`
}

function impAdicional(code){
const data=imp2.filter(r=>clean(r[0])===code)
if(!data.length)return ""
let rows=""
data.forEach(r=>{
rows+=`
<tr>
<td>${r[14]||""}</td>
<td>${r[17]||""}</td>
<td>${r[18]||""}</td>
<td>${r[20]||""}</td>
<td>${r[22]||""}</td>
<td>${r[23]||""}</td>
</tr>`
})
return`
<div class="card full">
<h3>IMP Adicionales</h3>
<table class="table">
<tbody>${rows}</tbody>
</table>
</div>`
}

function impVivvidecor(code){
const data=imp3.filter(r=>clean(r[0])===code)
if(!data.length)return ""
let rows=""
data.forEach(r=>{
rows+=`
<tr>
<td>${r[13]||""}</td>
<td>${r[14]||""}</td>
<td>${r[15]||""}</td>
<td>${r[16]||""}</td>
<td>${r[19]||""}</td>
<td>${r[20]||""}</td>
</tr>`
})
return`
<div class="card full">
<h3>IMP Vivvidecor</h3>
<table class="table">
<tbody>${rows}</tbody>
</table>
</div>`
}

function impReprocesos(code){
const data=imp4.filter(r=>clean(r[5])===code)
if(!data.length)return ""
let rows=""
data.forEach(r=>{
const solicitud = (r[8] || "")
.replace(/\r\n/g,"\n")
.replace(/\r/g,"\n")
.replace(/\n/g,"<br>")
const estado=r[19]||""
rows+=`
<tr>
<td>${r[0]||""}</td>
<td>${solicitud}</td>
<td>${estado}</td>
</tr>`
})
return`
<div class="card full">
<h3>IMP Reprocesos carpinteria</h3>
<table class="table">
<tbody>${rows}</tbody>
</table>
</div>`
}

init()

// push