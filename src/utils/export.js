//get导出excel
export function exportExcel(arg,url) {
  arg['admin_id'] = '15262575868677723';
  let arg_arr = [];
  for(let k in arg){
    arg_arr.push(`${k}=${arg[k]}`)
  }
  let export_url = `${location.origin}/${url}?${arg_arr.join('&')}`;
  window.open(export_url)
}
//post导出excel
export function exportPost(data, name, type) {
  var blob = null;
  if(type == '.xlsx'){
    blob = new Blob([data], { type: 'application/vnd.ms-excel'});
  }else if(type == '.csv'){
    blob = new Blob([data], { type: "text/csv,charset=UTF-8" });
  }

  let today = new Date();
  let tadayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const fileName = `${name}-${tadayDate}${type}`;
  const elink = document.createElement("a");
  elink.download = fileName;
  elink.style.display = "none";
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}