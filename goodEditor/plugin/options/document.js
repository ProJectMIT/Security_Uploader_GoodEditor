// ������� ���� �Լ�
process.prototype['document'] = {
	version : '0.1',
	// ��� Ȱ��ȭ ����
	active : true,
	init : function(sTapRows)
	{
		var thisobj = e.$g('documentDiv_' + sTapRows);
		if (thisobj != null)
		{
			thisobj.style.display = 'none';
		}
	},
	action : function(obj, sTapRows)
	{
		if (!e.$g('documentDiv_' + sTapRows)) {
			var documentObj = e.$c('div');
				documentObj.id = 'documentDiv_' + sTapRows;
				documentObj.className = 'colorPlug';
				documentObj.style.position = 'absolute';
				documentObj.style.width = 195 + 'px';
				documentObj.style.height = 170+ 'px';
				documentObj.style.display = 'block';
				documentObj.style.overflow = 'hidden';
				documentObj.innerHTML =	'<b>�ش� ���</b>�� �����ϴ� �� �Դϴ�.';

			e.$g('insertObj_' + sTapRows).appendChild(documentObj);
		} else {
			if (e.$g('documentDiv_' + sTapRows).style.display == 'none') {
				e.$g('documentDiv_' + sTapRows).style.display = 'block';
			} else {
				e.$g('documentDiv_' + sTapRows).style.display = 'none';
			}
		}
	}
};
