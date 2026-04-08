import { normalizeSheet } from "./parser.js";

export async function loadSheet(url){

  const res = await fetch(url);
  
  const text = await res.text();
  
  return parseCSV(text);
  
}

export async function loadSheetObjects(url){
  const rows = await loadSheet(url);
  return normalizeSheet(rows);
}

function parseCSV(text){

  const rows=[];
  let row=[];
  let current="";
  let insideQuotes=false;

  for(let i=0;i<text.length;i++){

    const char=text[i];
    const next=text[i+1];

    if(char === '"'){
      if(insideQuotes && next === '"'){
        current+='"';
        i++;
      }else{
        insideQuotes=!insideQuotes;
      }
      continue;
    }

    if(char === ',' && !insideQuotes){
      row.push(current);
      current="";
      continue;
    }

    if(char === '\n' && !insideQuotes){
      row.push(current);
      rows.push(row);
      row=[];
      current="";
      continue;
    }

    current+=char;

  }

  row.push(current);
  rows.push(row);

  return rows;

}