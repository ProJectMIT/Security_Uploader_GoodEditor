// �۲� ���� ���� �Լ�
process.prototype.Italic = {
	version : '0.1',
	// ��� Ȱ��ȭ ����
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('italic', false, null);
	}
};
