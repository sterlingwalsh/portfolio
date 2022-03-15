import { DataGridCSVData } from './datagridexport';


const encode = (str:string) => {
	str = encodeURIComponent(str);
	str = str.replace(/\b\#\w+/g, '');
	return str;
}

export const saveCSV = (data: DataGridCSVData, fileName?: string) => {
	let str = '';
	str = str + data.headers.join(',') + '\n';
	data.rowData.forEach((r) => {
		str += r.join(',') + '\n';
	});
	const bomCode = '\ufeff';
	let text = `data:attachment/csv;charset=utf-8,${bomCode}${encode(str)}`;

	const el = document.createElement('a');
	el.href = text;
	if (fileName) {
		el.download = fileName;
	} else {
		const d = new Date(Date.now());
		el.download = `Risk Architecture ${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
	}
	el.download += '.csv';
	el.click();
	el.remove();
};
