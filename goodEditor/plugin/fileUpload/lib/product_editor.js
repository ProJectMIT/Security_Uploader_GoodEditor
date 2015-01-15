/**
 * @class	productEditor
 * @author	M_FireFox (http://www.wscsx.com/)
 * @brief	productEditor Ŭ���� ����
 **/
function productEditor()
{
	this.version = '1.1.1';

	this.object = [];
	this.btnObject = [];
	this.idx = 0;

	this.listTop = 0;
}

/**
 * @brief	productEditor ���� ��ü ����
 * @param	document object ��ü, �ټ� ��������
 **/
productEditor.prototype.setObject = function(object)
{
	if (typeof object.length != 'undefined')
	{
		for(var i = 0; i < object.length; i++)
		{
			this.object[this.idx] = object[i];
			this.idx++;
		}
	}
	else
	{
		this.object[this.idx] = object;
		this.idx++;
	}
}

/**
 * @brief	productEditor�� ��ȯ
 **/
productEditor.prototype.action = function()
{
	for (var i = 0; i < this.idx; i++)
	{
		this.layout(i);
	}
}

/**
 * @brief	������ ���̾ƿ� �׸���
 * @param	number (productEditor key)
 **/
productEditor.prototype.layout = function(k)
{
	swf_file.uploadListObject(k);

	// className Setting
	this.object[k].className = 'p_object';

	// list
	var self = this;
	var listArea = e.$c('div');
		listArea.className = 'p_list';
		var btnObject = e.$c('div');
			btnObject.className = 'p_list_upload';
			swf.setParams('_idx=' + k + '&upload_url=' + swf_file.uploadURL + '&cross_domain=' + swf_file.crossDomain + '&format_desc=' + swf_file.formatDesc + '&format_exten=' + swf_file.formatExten);
			btnObject.innerHTML = swf.add('upload', swf_file.baseRoot + 'swf/upload.swf', 100, 30);
		var viewDiv = e.$c('div');
			viewDiv.className = 'p_list_upload_btn_bg';
			var viewBtn = e.$c('button');
				viewBtn.className = 'button';
				viewBtn.innerHTML = '���ε�';
			viewDiv.appendChild(viewBtn);

		var upBtn = e.$c('button');
			upBtn.className = 'button_2';
			upBtn.onclick = function()
			{
				if (self.listTop > 0) self.listTop -= 76;
				var oDiv = e.$g('productEditor_' + k + '_list').style.marginTop = '-' + self.listTop + 'px';
			}
			upBtn.innerHTML = '';

		var imgListArea = e.$c('div');
			imgListArea.className = 'p_list_list';
			var imgList = e.$c('div');
				imgList.id = 'productEditor_' + k + '_list';
			imgListArea.appendChild(imgList);

		var downBtn = e.$c('button');
			downBtn.className = 'button_2';
			downBtn.onclick = function()
			{
				if ((self.listTop + 76) <= ((swf_file.fileRows - 1) * 76)) self.listTop += 76;
				var oDiv = e.$g('productEditor_' + k + '_list').style.marginTop = '-' + self.listTop + 'px';
			}
			downBtn.innerHTML = '';

		listArea.appendChild(viewDiv);
		listArea.appendChild(btnObject);
		listArea.appendChild(upBtn);
		listArea.appendChild(imgListArea);
		listArea.appendChild(downBtn);

	// editor
	var editArea = e.$c('div');
		editArea.id = 'productEditor_' + k + '_edit';
		editArea.className = 'p_edit';
		// ���� ����
		var editToolObj = e.$c('div');
			editToolObj.id = 'p_edit_' + k + '_tool';
			editToolObj.className = 'p_edit_tool';
		// ���� ����
		var editContentArea = e.$c('div');
			editContentArea.id = 'p_edit_' + k + '_edit';
			editContentArea.className = 'p_edit_edit';
		editArea.appendChild(editToolObj);
		editArea.appendChild(editContentArea);

	this.object[k].appendChild(listArea);
	this.object[k].appendChild(editArea);

	// ������ ���� ��ư ���
	this.setToolbar(k);
}

/**
 * @brief		�����Ϳ� ���� ��ư���� ������ ���
 * @param		number (productEditor key)
 **/
productEditor.prototype.setToolbar = function(k)
{
	var self = this;
	var obj = {};

	/**
	 * @brief �������� ��ư ����
	 **/
	obj = {
		id : 'editor_insert_' + k,
		className : 'button',
		innerHTML : '<strong>��������</strong>',
		disabled : true,
		style : {
			'styleFloat' : 'left',
			'cssFloat' : 'left',
			'margin' : '1px 2px',
			'width' : '100px'
		},
		onclick : function(){
			for (var i = 0; i < swf_file.fileidx.length; i++)
			{
				var filename = swf_file.fileidx[i];
				var oTBounds = e.getBounds('p_edit_img_' + k + '_' + filename);
				var iData = '<img src="' + swf_file.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:' + oTBounds.width + 'px; height:' + oTBounds.height + 'px;" /><br />';

				var textObj = opener.document.getElementById(opener.goodEditor.obj);
				var ifrmObj = opener.document.getElementById(opener.goodEditor.obj + '_iframe');

				// �̹��� ���� ����
				textObj.value = textObj.value + iData;

				opener.goodEditor.editor.setContents(textObj, ifrmObj);
				// ������ ���� ���ε� ��Ͽ� �߰�
				opener.goodEditor.upload.addList(filename, getMBtoKB(swf_file.filesize[filename] + ' B'), 'image');
			}
			// ������â �ݱ�
			window.close();
		}
	};
	this.setToolButton(obj);

	/**
	 * @brief ���͸�ũ ��ư ����
	 **/
	obj = {
		id : 'editor_mask_' + k,
		className : 'button',
		innerHTML : '���͸�ũ',
		style : {
			'styleFloat' : 'left',
			'cssFloat' : 'left',
			'margin' : '1px 2px',
			'width' : '100px'
		},
		onclick : function(){
		}
	};
	//this.setToolButton(obj);

	/**
	 * @brief ������ ���� ��ư ����
	 **/
	obj = {
		id : 'editor_close_' + k,
		className : 'button',
		innerHTML : '<span style="color:#c00; font-weight:bold; font-size:12px;">X</span> ������ �ݱ�',
		style : {
			'styleFloat' : 'right',
			'cssFloat' : 'right',
			'margin' : '1px 2px',
			'width' : '110px',
			'border' : 0
		},
		onclick : function(){
			// �̰��� AJAX�� ���ε� �� ������ �����ϴ� �˰����� �߰� �մϴ�.

			// ������â �ݱ�
			window.close();
		}
	};
	this.setToolButton(obj);

	// ����� ��ư ���
	this.printToolButton(k);
}

/**
 * @brief		������ ���ٿ� ��ư �߰�
 * @param		object
 **/
productEditor.prototype.setToolButton = function(obj)
{
	this.btnObject[this.btnObject.length] = [];
	for(var k in obj)
	{
		this.btnObject[this.btnObject.length - 1][k] = obj[k];
	}
}

/**
 * @brief		����� ���� ��ư���� ���
 * @param		number (productEditor key)
 **/
productEditor.prototype.printToolButton = function(k)
{
	var obj = null;
	var oBtn = null;
	for(var i = 0; i < this.btnObject.length; i++)
	{
		obj = this.btnObject[i];
		oBtn = e.$c('button');
		for(var kn in obj)
		{
			if (kn == 'style')
			{
				for(var kk in obj.style)
				{
					oBtn.style[kk] = obj.style[kk];
				}
			}
			else
			{
				eval('oBtn.' + kn + ' = obj[kn]');
			}
		}

		e.$g('p_edit_' + k + '_tool').appendChild(oBtn);
	}
}

/**
 * @namespace	swf_file
 * @brief		��Ƽ ���Ͼ��ε� ���� SWF���� ����
 **/
var swf_file = {
	// ��Ƽ ���ε� SWF�� ���� �� �ν��� ���� Index Ű
	key : 0,
	// ��ü ���ε� ���ϼ�
	fileRows : 0,
	// productEditor BaseDir path
	baseRoot : '',
	// productEditor image upload (php, jsp, asp, asp.net, aspx, ...) action page
	uploadURL : '',
	// crossdomain.xml ��� ����
	crossDomain : '',
	// �̹��� ���
	imgRoot : '',
	// ���� ũ��
	filesize : [],
	// ���� ���ε尡�� Ȯ���� ���� ����
	formatDesc : '',
	// ���ε� ������ Ȯ����
	formatExten : '',

	/**
	 * @brief	��Ƽ ���ε� �̸����� ��� idx Ű �ʱ�ȭ
	 *			�÷��� ����� �� �ѹ��� ����Ǿ�� �Ѵ�.
	 * @param	number
	 **/
	uploadListObject : function(k)
	{
		this.fileidx = [];
		this.filesize = [];
		this.fileRows = 0;
		this.key = k;

		this.baseRoot = getJsBasePath() + 'plugin/fileUpload/lib/';
		this.imgRoot = getJsBasePath();
		this.crossDomain = this.baseRoot + 'crossdomain.xml';
		this.uploadURL = this.baseRoot + 'upload.php';
		this.formatDesc = 'Image files (*.jpg, *.jpeg, *.gif, *.png)';
		this.formatExten = '*.jpg; *.jpeg; *.gif; *.png';
	},

	/**
	 * @brief	���ε� ���н� ���� ���
	 * @param	string ���� ����
	 **/
	uploadError : function(errstr)
	{
		alert(errstr);
	},

	/**
	 * @brief	�������� ������ �����Ͽ����� ����
	 * @param	string �����̸�
	 **/
	uploadSelected : function(filename)
	{
		if (!this.filesize[filename])
		{
			// ���� index ��ȣ ����
			this.fileidx[this.fileidx.length] = filename;
		}

		if (!e.$g('p_list_' + this.key + '_' + filename))
		{
			// ���ο� �̹��� ���ε�
			var divObj = e.$c('div');
				divObj.id = 'p_list_' + this.key + '_' + filename;
				divObj.className = 'p_list_progress_body';
				var divPsnt = e.$c('div');
					divPsnt.className = 'p_list_progress_psnt';
				divObj.appendChild(divPsnt);
			e.$g('productEditor_' + this.key + '_list').appendChild(divObj);
		}
		else
		{
			// �̹� �����ϴ� �̹����� �� ���ε�� �̹��� ����
			var divPsnt = e.$c('div');
				divPsnt.className = 'p_list_progress_psnt';
			e.$g('p_list_' + this.key + '_' + filename).innerHTML = '';
			e.$g('p_list_' + this.key + '_' + filename).appendChild(divPsnt);
			if (confirm('�� �̹����� �� ���ε� �Ͻǰ�� ���� �������̽� ������ �ս� �� �� �ֽ��ϴ�.'))
			{
				// �̹��� ���� ���� ����
				e.$g('p_edit_' + this.key + '_' + filename).innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;">' +
																		'<tr><td align="center" valign="center" style="position:relative;">' +
																		'<div style="position:relative; overflow:visible;">' +
																		'<img id="p_edit_img_' + this.key + '_' + filename + '" src="' + this.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:80%;" />' +
																		'</div>' +
																		'</td></tr>' +
																		'</table>';
				// �� ���ε��� �̹����� ����ȭ�� ��ȯ
				this._uploadModify(this.key, filename);
			}
		}
		// get filerows
		this.fileRows++;
	},

	/**
	 * @brief	���� ���� ���ε� �����Ȳ�� ǥ��
	 * @param	string �����̸�
	 * @param	number ������� ���ε�� byte
	 * @param	number �� ���� ���ε� byte
	 **/
	uploadProgress : function(filename, nowPsnt, totalPsnt)
	{
		// ���� ũ�� ����
		this.filesize[filename] = totalPsnt;

		// ���� ���ε� ���� ���
		e.$g('p_list_' + this.key + '_' + filename).getElementsByTagName('div')[0].innerHTML =	'<table border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;">' +
																								'<tr><td align="center" valign="center">' +
																									Math.round(nowPsnt / totalPsnt * 100) + '%' +
																								'</td></tr>' +
																								'</table>';
		// ���ε� progress bar ���
		e.$g('p_list_' + this.key + '_' + filename).getElementsByTagName('div')[0].style.width = Math.round(nowPsnt / totalPsnt * 100) + '%';
	},

	/**
	 * @brief	���ε� �Ϸ�� ����
	 * @param	string �����̸�
	 **/
	uploadComplete : function(filename)
	{
		// ���� ���ε� ������ �������� ��� Ȱ��ȭ
		e.$g('editor_insert_' + swf_file.key).disabled = false;

		var data =	'<a href="#" onclick="return swf_file._uploadModify(' + this.key + ', \'' + filename + '\');">' +
					'<img src="' + this.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:100px; height:75px;" />' +
					'</a>';
		// 0.2���Ŀ� ��� �̸����⿡ �߰� �� ���� ���� ����
		setTimeout(function(){
			e.$g('p_list_' + swf_file.key + '_' + filename).innerHTML = data;

			// ���ο� �������� ����
			var editObj = e.$c('div');
				editObj.id = 'p_edit_' + swf_file.key + '_' + filename;
				editObj.className = 'p_edit_area';
				editObj.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;">' +
									'<tr><td align="center" valign="center" style="position:relative;">' +
									'<div style="position:relative;">' +
									'<img id="p_edit_img_' + swf_file.key + '_' + filename + '" src="' + swf_file.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:80%;" />' +
									'</div>' +
									'</td></tr>' +
									'</table>';
			e.$g('p_edit_' + swf_file.key + '_edit').appendChild(editObj);

			// �̹��� ������¡
			size('p_edit_img_' + swf_file.key + '_' + filename, 600, 400);
		}, 200);
	},

	/**
	 * @brief	�̸����� ����� �̹��� Ŭ���� ����
	 * @param	string �����̸�
	 **/
	_uploadModify : function(k, filename)
	{
		// zIndex = 5 : ����
		var oDivEdit = e.$g('productEditor_' + this.key + '_edit').getElementsByTagName('div');
		for (var i = 0; i < oDivEdit.length; i++)
		{
			if (oDivEdit[i].className == 'p_edit_area top')
			{
				oDivEdit[i].className = 'p_edit_area';
			}
		}
		e.$g('p_edit_' + this.key + '_' + filename).className = 'p_edit_area top';
		return false;
	}
};

/**
 * @brief	�̹��� ������¡ ���� ��� �Լ�
 **/
function _debug(o)
{
	var oTBounds = e.getBounds(o.id);
	var debug = e.$g('debug' + resize.sizeIndex[o.id]);
		debug.style.display = 'block';
		debug.style.top = oTBounds.top + 'px';
		debug.style.left = oTBounds.left + 'px';
		debug.innerHTML =	'W : <strong>' + Math.round(oTBounds.width) + '</strong>' +
							'&nbsp;&nbsp;&nbsp;' +
							'H : <strong>' + Math.round(oTBounds.height) + '</strong>';
}

/**
 * @brief	�̹��� ������¡ �Լ�
 **/
function size(objId, w, h)
{
	var oTBounds = e.getBounds(objId);
	if (oTBounds.width > w) e.$g(objId).style.width = w + 'px';
	if (oTBounds.height > h) e.$g(objId).style.height = h + 'px';

	// w = ���α���, h = ���α���
	// w, h ��������
	resize.setResize(objId);
	//resize.setResizeType('w');
	//resize.setResizeType('h');
	resize.setResizeWidth(w);
	resize.setResizeHeight(h);

	resize.startFunction(_debug);
	resize.playFunction(_debug);
	resize.exitFunction(_debug);

	if (e.$g('debug' + resize.sizeIndex[objId]) == null)
	{
		// status
		var statusArea = e.$c('div');
			statusArea.id = 'debug' + resize.sizeIndex[objId];
			statusArea.className = 'p_status';

		e.$g(objId).parentNode.appendChild(statusArea);

		e.style.alpha('debug' + resize.sizeIndex[objId], 50);
	}
}

// �巡�� ����
e.noDrag(true);
