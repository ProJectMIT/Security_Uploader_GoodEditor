// ���� ÷�� �Լ�
process.prototype.file = {
	version : '0.1',
	// ��� Ȱ��ȭ ����
	active : true,
	action : function(obj, sTapRows)
	{
		var kb = getKB(document, 'div', 'fileinfoByte');
		//if ( kb >= 3072) {
		//	alert('�ִ� 3M�̻� ���ε� �ϽǼ� �����ϴ�.');
		//} else {
			openWindow(getJsBasePath() + 'plugin/fileUpload/lib/file_upload.php', 350, 140);
		//}
	}
};
