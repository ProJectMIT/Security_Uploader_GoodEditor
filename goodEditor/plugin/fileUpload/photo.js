// �̹��� ÷�� �Լ�
process.prototype.photo = {
	version : '1.3',
	// ��� Ȱ��ȭ ����
	active : true,
	// ���ε� ������ �ִ� KB
	maxKBytes : 10240,
	action : function(obj, sTapRows)
	{
		var kb = getKB(document, 'div', 'fileinfoByte');
		if ( kb >= this.maxKBytes) {
			alert('�ִ� ' + maxKBytes + 'KB �̻� ���ε� �ϽǼ� �����ϴ�.');
		} else {
			openWindow(getJsBasePath() + 'plugin/fileUpload/lib/imageEditor.php', 800, 539);
		}
	}
};
