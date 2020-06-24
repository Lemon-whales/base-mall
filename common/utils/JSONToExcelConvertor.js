// //测试的json数据
// var data3=[{"id":10000,"username":"user-0","sex":"女","city":"城市-0","sign":"签名-0","experience":255,"logins":24},
// {"id":10001,"username":"user-1","sex":"男","city":"城市-1","sign":"签名-1","experience":884,"logins":58} ,
// {"id":10002,"username":"user-2","sex":"女","city":"城市-2","sign":"签名-2","experience":650,"logins":77}]

// //自定义标题栏
// var title=['用户名','性别','城市','签名','经验']  
// //自定义过滤栏（不需要导出的行）
// var filter=['id','logins'] 
// let url = JSONToExcelConvertor(data3,"report",title,filter);

function JSONToExcelConvertor(JSONData, FileName, title, filter) {
	if (!JSONData)
		return;
	//转化json为object
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

	var excel = "<table>";

	//设置表头  
	var row = "<tr>";

	if (title) {
		//使用标题项
		for (var i in title) {
			row += "<th align='center'>" + title[i] + '</th>';
		}

	} else {
		//不使用标题项
		for (var i in arrData[0]) {
			row += "<th align='center'>" + i + '</th>';
		}
	}

	excel += row + "</tr>";

	//设置数据  
	for (var i = 0; i < arrData.length; i++) {
		var row = "<tr>";

		for (var index in arrData[i]) {
			//判断是否有过滤行
			if (filter) {
				if (filter.indexOf(index) == -1) {
					var value = arrData[i][index] == null ? "" : arrData[i][index];
					row += '<td>' + value + '</td>';
				}
			} else {
				var value = arrData[i][index] == null ? "" : arrData[i][index];
				row += "<td align='center'>" + value + "</td>";
			}
		}

		excel += row + "</tr>";
	}

	excel += "</table>";

	var excelFile =
		"<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
	excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
	excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
	excelFile += '; charset=UTF-8">';
	excelFile += "<head>";
	excelFile += "<!--[if gte mso 9]>";
	excelFile += "<xml>";
	excelFile += "<x:ExcelWorkbook>";
	excelFile += "<x:ExcelWorksheets>";
	excelFile += "<x:ExcelWorksheet>";
	excelFile += "<x:Name>";
	excelFile += "{worksheet}";
	excelFile += "</x:Name>";
	excelFile += "<x:WorksheetOptions>";
	excelFile += "<x:DisplayGridlines/>";
	excelFile += "</x:WorksheetOptions>";
	excelFile += "</x:ExcelWorksheet>";
	excelFile += "</x:ExcelWorksheets>";
	excelFile += "</x:ExcelWorkbook>";
	excelFile += "</xml>";
	excelFile += "<![endif]-->";
	excelFile += "</head>";
	excelFile += "<body>";
	excelFile += excel;
	excelFile += "</body>";
	excelFile += "</html>";


	var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
	
	
	return  uri;
	var link = document.createElement("a");
	link.href = uri;

	link.style = "visibility:hidden";
	link.download = FileName + ".xls";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

module.exports = {
  JSONToExcelConvertor
}