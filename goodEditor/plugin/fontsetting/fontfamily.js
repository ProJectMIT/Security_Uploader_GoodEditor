// �۲� ���� �Լ�
process.prototype.fontfamily = {
	version : '0.2',
	// ��� Ȱ��ȭ ����
	active : true,
	// fontFamily List
	fontNameArray	: ['arial', 'verdana', '����', '����', '����', '�ü�', 'HY�߰��', 'HY�߰��', 'HY�Ÿ���'],
	init : function(sTapRows)
	{
		var thisobj = e.$g('fontFamilyDiv_' + sTapRows);
		if (thisobj != null)
		{
			thisobj.style.display = 'none';
		}
	},
	action : function(obj, sTapRows)
	{
		if(!e.$g('fontFamilyDiv_' + sTapRows)){
			// �۲� ���� ����
			var fontFamilyDiv = e.$c('div');
				fontFamilyDiv.id = 'fontFamilyDiv_' + sTapRows;
				fontFamilyDiv.style.clear = 'both';
				fontFamilyDiv.style.top = 30 + 'px';
				fontFamilyDiv.style.left = 5 + 'px';
				fontFamilyDiv.style.position = 'absolute';
				fontFamilyDiv.style.border = '1px solid #ddd';
				fontFamilyDiv.style.background = '#fff';
				fontFamilyDiv.style.width = 80 + 'px';
				//fontFamilyDiv.style.height = 130 + 'px';
				//fontFamilyDiv.style.overflow = 'auto';
				fontFamilyDiv.style.fontSize = 11 + 'px';
				fontFamilyDiv.style.display = 'block';
				fontFamilyDiv.style.fontFamily = '����';
				for(var i=0; i < this.fontNameArray.length; i++){
					fontFamilyDiv.innerHTML +=	'<div style="cursor:default; margin:1px;" '+
												'onmouseover="this.style.background=\'#eee\';this.style.color=\'#555\';" '+
												'onmouseout="this.style.background=\'\';this.style.color=\'#000\';">'+
												'	<a href="javascript:void(0);" style="display:block; padding:3px;" onclick="buttonEvent.setFont(\''+this.fontNameArray[i]+'\');">'+
												this.fontNameArray[i] +
												'	</a>'+
												'</div>';
				}
				e.$g('insertObj_' + sTapRows).appendChild(fontFamilyDiv);
			e.$g('fontFamilyDiv_' + sTapRows).focus();
			e.event(e.$g('fontFamilyDiv_' + sTapRows), "click", function(){ e.$g('fontFamilyDiv_' + sTapRows).style.display = 'none'; });
		}else if(e.$g('fontFamilyDiv_' + sTapRows).style.display == 'block'){
			e.$g('fontFamilyDiv_' + sTapRows).style.display = 'none';
		}else{
			e.$g('fontFamilyDiv_' + sTapRows).style.display = 'block';
			e.$g('fontFamilyDiv_' + sTapRows).focus();
		}
	}
};

// �ش� ����� ����ϴ� �׼� �Լ�
button.prototype.setFont = function(fontFamily)
{
	if(e.IE == 1){
		var sel = e.$g(goodEditor.obj + '_iframe').contentWindow.document.selection;
		var rang = sel.createRange();

		rang.select();
		if ( goodEditor.cPosition != null ) {
			// ������ ������ ���� �ϸ�ũ�� �̵�
			rang.moveToBookmark(goodEditor.cPosition);
		}

		rang.execCommand('fontname', false, fontFamily);
		e.$g(goodEditor.obj + '_iframe').contentWindow.focus();
	}else{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('fontname', false, fontFamily);
	}
}
