// �۲� �鿩���� �Լ�
process.prototype['in'] = {
	version : '0.1',
	// ��� Ȱ��ȭ ����
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('Indent', false, null);
	}
};
