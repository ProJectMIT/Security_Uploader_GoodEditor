// �۲� ��� ���� �Լ�
process.prototype.center = {
	version : '0.1',
	// ��� Ȱ��ȭ ����
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('justifycenter', false, null);
	}
};
