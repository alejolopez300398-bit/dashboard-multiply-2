import { SHEET_ID } from "./config.js";
import { loadSheet } from "./modules/sheets.js";
import { loadSheetObjects } from "./modules/sheets.js";
import { clean, linkify } from "./modules/utils.js";

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
  
  console.log("cargando resumen...")
  resumen = await loadObjects(urls.resumen)
  resumen = resumen.map(r => {

    function formatFecha(val){

      if(val === "" || val === null || val === undefined) return "-";
    
      // si ya viene dd/mm/yyyy → devolver directo
      if(typeof val === "string" && val.includes("/")){
        return val.trim();
      }
    
      // si viene como número (serial sheets)
      if(typeof val === "number" || !isNaN(val)){
        const num = Number(val);
        if(!isNaN(num)){
          const excelEpoch = new Date(1899,11,30);
          const d = new Date(excelEpoch.getTime() + num*86400000);
    
          const dia = String(d.getDate()).padStart(2,"0");
          const mes = String(d.getMonth()+1).padStart(2,"0");
          const anio = d.getFullYear();
    
          return `${dia}/${mes}/${anio}`;
        }
      }
    
      return val;
    }

    // Si existe la columna vacía "", renombrarla a "contacto_contratista"
    if(r.contacto_contratista === undefined || r.contacto_contratista === null){
      r.contacto_contratista = "-"
    } else {
      r.contacto_contratista = String(r.contacto_contratista).trim()
      if(r.contacto_contratista === "") r.contacto_contratista = "-"
    }

    return r;
  });
  console.log("resumen cargado", resumen)
  console.log("HEADERS:", Object.keys(resumen[0]))
  console.log("estructura resumen", resumen[0])
  
  imp1 = await load(urls.imp1)
  imp2 = await load(urls.imp2)
  imp3 = await load(urls.imp3)
  imp4 = await load(urls.imp4)
  
  }catch(e){
  console.error("ERROR INIT:", e)
  }
  
  document.getElementById("loading").style.display="none"
  }

async function load(url){
  try{
  const data = await loadSheet(url)
  return data.slice(1)
  }catch(e){
  return []
  }
  }
  
  async function loadObjects(url){
  try{
  const data = await loadSheetObjects(url)
  return data
  }catch(e){
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
  
  const row = resumen.find(r => clean(r.codigo) === code)
  if(!row)return
  
  const values = Object.values(row)
  
  dash.style.display="grid"
  
  dash.innerHTML=`
  
  ${card("Datos Proyecto",
  ["cliente","contacto_cliente","correo_cliente","proyecto","direccion_proyecto","tipo_proyecto"],
  [
  row.cliente,
  row.contacto_cliente,
  row.correo_cliente,
  row.proyecto,
  row.direccion_proyecto,
  row.tipo_proyecto
  ])}
  
  ${card("Equipo proyecto",
  ["coordinador","residente","contratista_obra","contacto_contratista"],
  [
  row.coordinador,
  row.residente,
  row.contratista_obra,
  row.contacto_contratista
  ])}

  ${card("Diseño",
  ["vendedor","lider_diseno","disenador","padlet_o_ppt","ppto_aprobado","ppto_decor","renders","planos_obra","planos_muebles"],
  [
    row.vendedor,
    row.lider_diseno,
    row.disenador,
    row.padlet_o_ppt,
    row.ppto_aprobado,
    row.ppto_decor,
    row.renders,
    row.planos_obra,
    row.planos_muebles
    ])}
  
    ${card("fechas_proyecto",
    ["inicio_obra","entrega_inicial","entrega_final"],
    [
      formatFecha(row.inicio_obra),
      formatFecha(row.entrega_inicial),
      formatFecha(row.entrega_final)
    ])}
  
  ${card("carpinteria",
    ["estado","tipo","instalador","meta_rectificacion","real_rectificacion","estado_rectificacion","link_rectificacion","meta_facturacion","real_facturacion","despacho_meta","despacho_real","ingreso_meta","ingreso_real","fin_meta","fin_real"],
    [
      row.estado,
      row.tipo,
      row.instalador,
      formatFecha(row.meta_rectificacion),
      formatFecha(row.real_rectificacion),
      row.estado_rectificacion,
      row.link_rectificacion,
      formatFecha(row.meta_facturacion),
      formatFecha(row.real_facturacion),
      formatFecha(row.despacho_meta),
      formatFecha(row.despacho_real),
      formatFecha(row.ingreso_meta),
      formatFecha(row.ingreso_real),
      formatFecha(row.fin_meta),
      formatFecha(row.fin_real)
    ])}

    ${card("cronograma",
    ["base_empalme","repro_empalme","real_empalme","retraso_empalme","com_empalme","base_ingreso","repro_ingreso","real_ingreso","retraso_ingreso","com_ingreso","base_gris","repro_gris","real_gris","retraso_gris","com_gris","base_blanca","repro_blanca","real_blanca","retraso_blanca","com_blanca","base_enchapes","repro_enchapes","real_enchapes","retraso_enchapes","com_enchapes","base_piso","repro_piso","real_piso","retraso_piso","com_piso","base_recti_muebles","repro_recti_muebles","real_recti_muebles","retraso_recti_muebles","com_recti_muebles","base_carpinteria","repro_carpinteria","real_carpinteria","retraso_carpinteria","com_carpinteria","base_mesones","repro_mesones","real_mesones","retraso_mesones","com_mesones","base_divisiones","repro_divisiones","real_divisiones","retraso_divisiones","com_divisiones","base_guardaescobas","repro_guardaescobas","real_guardaescobas","retraso_guardaescobas","com_guardaescobas","base_remates","repro_remates","real_remates","retraso_remates","com_remates"],
    [
      formatFecha(row.base_empalme),
      formatFecha(row.repro_empalme),
      formatFecha(row.real_empalme),
      row.retraso_empalme,
      row.com_empalme,
      formatFecha(row.base_ingreso),
      formatFecha(row.repro_ingreso),
      formatFecha(row.real_ingreso),
      row.retraso_ingreso,
      row.com_ingreso,
      formatFecha(row.base_gris),
      formatFecha(row.repro_gris),
      formatFecha(row.real_gris),
      row.retraso_gris,
      row.com_gris,
      formatFecha(row.base_blanca),
      formatFecha(row.repro_blanca),
      formatFecha(row.real_blanca),
      row.retraso_blanca,
      row.com_blanca,
      formatFecha(row.base_enchapes),
      formatFecha(row.repro_enchapes),
      formatFecha(row.real_enchapes),
      row.retraso_enchapes,
      row.com_enchapes,
      formatFecha(row.base_piso),
      formatFecha(row.repro_piso),
      formatFecha(row.real_piso),
      row.retraso_piso,
      row.com_piso,
      formatFecha(row.base_recti_muebles),
      formatFecha(row.repro_recti_muebles),
      formatFecha(row.real_recti_muebles),
      row.retraso_recti_muebles,
      row.com_recti_muebles,
      formatFecha(row.base_carpinteria),
      formatFecha(row.repro_carpinteria),
      formatFecha(row.real_carpinteria),
      row.retraso_carpinteria,
      row.com_carpinteria,
      formatFecha(row.base_mesones),
      formatFecha(row.repro_mesones),
      formatFecha(row.real_mesones),
      row.retraso_mesones,
      row.com_mesones,
      formatFecha(row.base_divisiones),
      formatFecha(row.repro_divisiones),
      formatFecha(row.real_divisiones),
      row.retraso_divisiones,
      row.com_divisiones,
      formatFecha(row.base_guardaescobas),
      formatFecha(row.repro_guardaescobas),
      formatFecha(row.real_guardaescobas),
      row.retraso_guardaescobas,
      row.com_guardaescobas,
      formatFecha(row.base_remates),
      formatFecha(row.repro_remates),
      formatFecha(row.real_remates),
      row.retraso_remates,
      row.com_remates
    ])}

  ${impPedido(code)}
  ${impAdicional(code)}
  ${impVivvidecor(code)}
  ${impReprocesos(code)}
  
  `
  
  initAccordion()
  }

  function formatFecha(val){
    if(val === "" || val === null || val === undefined) return "-";
  
    // Si es número de serie (Sheets), convertir
    if(typeof val === "number"){
      const excelEpoch = new Date(1899,11,30);
      const d = new Date(excelEpoch.getTime() + val*24*60*60*1000);
      const dia = String(d.getDate()).padStart(2,"0");
      const mes = String(d.getMonth()+1).padStart(2,"0");
      const anio = d.getFullYear();
      return `${dia}/${mes}/${anio}`;
    }
  
    // Si viene como string con formato dd/mm/yyyy o mm/dd/yyyy
    if(typeof val === "string"){
      // Limpiar espacios
      val = val.trim();
      // Detectar si es fecha dd/mm/yyyy
      const fechaParts = val.split("/");
      if(fechaParts.length === 3){
        const dia = fechaParts[0].padStart(2,"0");
        const mes = fechaParts[1].padStart(2,"0");
        const anio = fechaParts[2];
        return `${dia}/${mes}/${anio}`;
      }
  
      // Si es string tipo número (Sheets serial que llegó como string)
      if(!isNaN(val)){
        const excelEpoch = new Date(1899,11,30);
        const d = new Date(excelEpoch.getTime() + Number(val)*24*60*60*1000);
        const dia = String(d.getDate()).padStart(2,"0");
        const mes = String(d.getMonth()+1).padStart(2,"0");
        const anio = d.getFullYear();
        return `${dia}/${mes}/${anio}`;
      }
  
      // Si no es reconocible, devolver tal cual
      return val;
    }
  
    return "-";
  }

function initAccordion(){
document.querySelectorAll(".card-header").forEach(header=>{
header.addEventListener("click",()=>{

const card = header.closest(".card")

document.querySelectorAll(".card").forEach(c=>{
c.classList.remove("open")
})

card.classList.add("open")

})
})
}

function card(t, l, v) {
  let h = `
  <div class="card">
    <div class="card-header">${t}</div>
    <div class="card-body">
  `;

  l.forEach((label, i) => {
    let val = v[i] ?? "-";

    // ✅ Si es un link, envolverlo en <a> clickeable
    if (typeof val === "string" && val.startsWith("http")) {
      val = `<a href="${val}" target="_blank" rel="noopener noreferrer">${val}</a>`;
    }

    h += `
      <div class="row">
        <div class="label">${label}</div>
        <div class="value">${val}</div>
      </div>
    `;
  });

  h += `
    </div>
  </div>
  `;

  return h;
}

function wrapCard(title,content){
return`
<div class="card">
<div class="card-header">${title}</div>
<div class="card-body">
${content}
</div>
</div>`
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

return wrapCard("IMP Pedido 1 y 2",
`<div class="table-container">
<table>
<tbody>${rows}</tbody>
</table>
</div>`)
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

return wrapCard("IMP Adicionales",
`<div class="table-container">
<table>
<tbody>${rows}</tbody>
</table>
</div>`)
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

return wrapCard("IMP Vivvidecor",
`<div class="table-container">
<table>
<tbody>${rows}</tbody>
</table>
</div>`)
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

rows+=`
<tr>
<td>${r[0]||""}</td>
<td>${solicitud}</td>
<td>${r[19]||""}</td>
</tr>`
})

return wrapCard("IMP Reprocesos carpinteria",
`<div class="table-container">
<table>
<tbody>${rows}</tbody>
</table>
</div>`)
}

init()

window.resumen = resumen;