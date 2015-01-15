// �⺻ ��ü���� NameSpace
//
// �˸� :	�Ʒ��� e ���ӽ����̽��� �Ʒ��� ��� ���̺귯������ ���Ǵ�
//			���� �⺻���� �ʼ� ���̺귯�� �Դϴ�.
var e = {
	// IE ������ üũ
	//
	// ��� : e.isIE([int]);
	// ��) e.isIE(567); // IE 5,6,7������ ��� true
	isIE : function(str)
	{
		var ieCheck = navigator.appVersion;
		var addVer = (typeof str != 'undefined')?' [' + str + ']':'';
		var ieCheckReg = null;
		eval('ieCheckReg = ieCheck.replace(/MSIE' + addVer + '/)');
		if (ieCheckReg != ieCheck)
		{
			ieCheck = null;
			addVer = null;
			ieCheckReg = null;

			return true;
		}
		else
		{
			ieCheck = null;
			addVer = null;
			ieCheckReg = null;

			return false;
		}
	},

	// createElement
	$c : function(o)
	{
		return document.createElement(o);
	},

	// getElementById - Style Option
	$s : function(o)
	{
		if ( typeof(e.$g(o)) != 'undefined' )
		{
			return e.$g(o).style;
		}
		else
		{
			return false;
		}
	},

	// getElementById
	$g : function(o)
	{
		return document.getElementById(o);
	},

	// getElementsByTagName
	$gTn : function(o)
	{
		return document.getElementsByTagName(o);
	},

	// getElementsByName
	$gNn : function(o)
	{
		return document.getElementsByName(o);
	},

	// depulicate Element
	// �ش� ��ü�� ����
	$cp : function(o, newId, rtn)
	{
		var copyObj = o.cloneNode(true);
			copyObj.id = newId;

		try
		{
			if (typeof rtn == 'undefined')
				o.parentNode.appendChild(copyObj);
			else
				return copyObj;
		}
		finally
		{
			copyObj = null;
		}
	},

	// removeElement
	// �ش� ��ü�� ����
	$d : function(o)
	{
		var obj = e.$g(o);
		if ( obj )
		{
			obj.parentNode.removeChild(obj);
		}

		obj = null;
	},

	// �ش� ��ü�� style�ɼ��� ���ڷ� ����
	getPx : function(obj, opt, pdata)
	{
		return Number(obj.style[opt].replace(pdata, ''));
	},

	// �ش� ��ü�� offsetX(Y, Width, Height)�� �����ϴ� �Լ�
	getBounds : function(objId){
		var tag = e.$g(objId);
		var ret = new Object();

		// IE 5, 6, 7 ������ ���� �ٸ� top, left �� ����
		var nIE = 0;
		if (e.isIE(567) == true)
			nIE = 2;

		var rect = null;
		var box = null;
		if (tag.getBoundingClientRect)
		{
			//if( navigator.appVersion.indexOf("MSIE 7") > -1)
			rect = tag.getBoundingClientRect();
			ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
			ret.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop) - nIE;
			ret.width = rect.right - rect.left - nIE;
			ret.height = rect.bottom - rect.top;
		}
		else
		{
			box = document.getBoxObjectFor(tag);
			ret.left = box.x;
			ret.top = box.y;
			ret.width = box.width;
			ret.height = box.height;
		}

		tag = null;
		nIE = null;
		rect = null;
		box = null;

		return ret;
	},

	// No Selected, Drag, ContextMenu...
	noDrag : function(v)
	{
		if (v == true)
		{
			document.oncontextmenu	= new Function ("return false");
			document.ondragstart	= new Function ("return false");
			document.onselectstart	= new Function ("return false");
			setTimeout(function(){ e.noDrag(true); }, 1000);
		}
	},

	// removeEvent
	removeEvent : function(obj, type, fn)
	{
		if (obj.removeEventListener)
			obj.removeEventListener(type, fn, false);
		else if(obj.detachEvent)
			obj.detachEvent('on' + type, fn);
	},

	// addEvent
	event : function(obj, type, fn)
	{
		if (obj.addEventListener)
			obj.addEventListener(type, fn, false);
		else if (obj.attachEvent)
			obj.attachEvent('on' + type, fn);
	},

	// style ���� Namespace
	style :
	{
		// ���� ����
		alpha : function(obj, alp)
		{
			var o = e.$s(obj);

			o.filter = 'alpha(opacity=' + alp + ')';
			o.opacity = (alp / 100);
			o.MozOpacity = (alp / 100);

			o = null;
		}
	}
};

// �巡�� ��ü���� Namespace
//
// �˸� :
//		�Ʒ� �巡�� �Լ��� ���� �巡���� ��ġ�� CSS�� TOP, LEFT �� ���� �����ϹǷ�
//		��Ÿ POSITION�� �ʿ� �ɼ��� ����ڰ� ���� ��ü�� �����ϼž� �մϴ�.
var drag = {
	// �巡�� ��ü �ε���
	nIndex : -1,
	// �巡�� ��ü
	dragObj : new Array(),
	// �ش� �巡�� ��ü�� �ε���
	dragIndex : new Array(),
	// �巡�� ��ǥ
	dragData : new Array(),
	// �巡�� ����
	dragState : new Array(),
	// �巡�� ���� ��ü
	areaObj : new Array(),
	// �巡�� �̵� ���� ���� ��ü
	moveAreaObj : new Array(),
	// �巡�� ���� �Լ� ����
	dragFunc : new Array(),
	// �巡�� ���� ȯ�溯��
	dragConfig : new Array(),
	// �巡�� ���� X�� ���ѿ��� ���ú���
	dragXData : new Array(),
	// �巡�� ���� Y�� ���ѿ��� ���ú���
	dragYData : new Array(),

	// ������ ���� ����
	//
	// ��� : drag.setMove(bool, bool);
	setMove : function(bXmove, bYmove)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setMove() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragConfig[obj] = new Array();
		this.dragConfig[obj]['move_x'] = bXmove;
		this.dragConfig[obj]['move_y'] = bYmove;

		obj = null;
	},

	// �̵���ų ��ü�� ����
	//
	// ��� : drag.setDrag(string);
	setDrag : function(obj)
	{
		var o = e.$g(obj);
		// ��ü�� �������� ���� ���
		if (o == null)
		{
			alert('drag.setDrag() : `' + obj + '` ��ü�� ã�� �� �����ϴ�.');
			return false;
		}

		// drag �ε��� ����
		this.nIndex++;
		// drag ��ü object ����
		this.dragObj[this.nIndex] = obj;
		this.dragIndex[obj] = this.nIndex;

		// drag ����
		this.dragStart(o);

		o = null;
	},

	// ��ü�� �̵��� ������ ����
	//
	// ��� : drag.setArea(string);
	setArea : function(objId)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setArea() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		// area ��ü object ����
		// ��ü�� �������� ���� ���
		var o = e.$g(objId);
		if (o == null)
		{
			alert('drag.setArea() : `' + objId + '` ��ü�� ã�� �� �����ϴ�.');
			return false;
		}
		this.areaObj[obj] = objId;
	},

	// �ش� ��ü �ȿ����� �̵��� �����ϵ��� ������ ����
	//
	// ��� : drag.setMoveArea(string);
	setMoveArea : function(objId)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setMoveArea() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.moveAreaObj[obj] = objId;
	},

	// �ش� ���� �ȿ����� �̵��� �����ϵ��� X�� ������ ����
	//
	// ��� : drag.setXMoveArea(int, int);
	setXMoveArea : function(nStartX, nExitX)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setXMoveArea() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragXData[obj] = new Array();
		this.dragXData[obj]['start']	= nStartX;
		this.dragXData[obj]['exit']		= nExitX;
	},

	// �ش� ���� �ȿ����� �̵��� �����ϵ��� Y�� ������ ����
	//
	// ��� : drag.setYMoveArea(int, int);
	setYMoveArea : function(nStartY, nExitY)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setYMoveArea() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragYData[obj] = new Array();
		this.dragYData[obj]['start']	= nStartY;
		this.dragYData[obj]['exit']		= nExitY;
	},

	// �巡�װ� ���۵ɶ� �����ϴ� �Լ� ���
	//
	// ��� : drag.startFunction(function);
	startFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.startFunction() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragFunc['start' + obj] = func;
	},

	// �巡�װ� �������϶� �����ϴ� �Լ� ���
	//
	// ��� : drag.playFunction(function);
	playFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.playFunction() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragFunc['play' + obj] = func;
	},

	// �巡�װ� ����ɶ� �����ϴ� �Լ� ���
	//
	// ��� : drag.exitFunction(function);
	exitFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.exitFunction() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragFunc['exit' + obj] = func;
	},

	// �ش� ��ü�� �������� �ö������ �����ϴ� �Լ� ���
	//
	// ��� : drag.areaFunction(function);
	areaFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.areaFunction() �Լ��� ����ϱ� ���� drag.setDrag() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.dragFunc['area' + obj] = func;
	},

	// �巡�� ���� �Լ�
	//
	// ��� : drag.dragStart(object);
	dragStart : function(obj)
	{
		// �̺�Ʈ ���
		e.event(obj, 'mousedown', drag.d_start);
	},

	// �巡�� ���� �Լ�
	//
	// ��� : drag.dragPlay(object);
	dragPlay : function(obj)
	{
		// �̺�Ʈ ���
		e.event(document.documentElement, 'mousemove', function(event){ drag.d_play(event, obj); });
	},

	// �巡�� ���� �Լ�
	//
	// ��� : drag.dragExit(object);
	dragExit : function(obj)
	{
		// �̺�Ʈ ���
		e.event(document.documentElement, 'mouseup', function(event){ drag.d_exit(event, obj); });
	},

	// �巡�� ���� ���� �Լ�
	//
	// ��� : drag.d_start([event ��ü]);
	d_start : function(event)
	{
		if (e.isIE() == true)
			var obj = event.srcElement;
		else
			var obj = event.target;

		var data = e.getBounds(obj.id);

		drag.dragState[obj.id] = 'play';
		if (drag.dragData[obj.id] == null)
			drag.dragData[obj.id] = new Object();
		drag.dragData[obj.id].x = (event.clientX - data.left);
		drag.dragData[obj.id].y = (event.clientY - data.top);
		if (obj.style.position == 'relative' && drag.dragData[obj.id].d == null)
			drag.dragData[obj.id].d = data;

		// �巡�� �̺�Ʈ ���
		drag.dragPlay(obj);
		drag.dragExit(obj);

		// ���� �̺�Ʈ�� �����ϴ� �Լ� ����
		if (typeof drag.dragFunc['start' + obj.id] != 'undefined')
			drag.dragFunc['start' + obj.id](obj);
	},

	// �巡�� �������϶� ���� �Լ�
	//
	// ��� : drag.d_play(event ��ü, object);
	d_play : function(event, obj)
	{
		if (drag.dragState[obj.id] == 'play')
		{
			var x = event.clientX;
			var y = event.clientY;
			var data = drag.dragData[obj.id];
			var config = drag.dragConfig[obj.id];

			// X, Y ���� ������ ���� - �⺻��
			if (typeof drag.dragConfig[obj.id] == 'undefined')
			{
				config = new Array();
				config['move_x'] = true;
				config['move_y'] = true;
			}

			// Y�� ������ ����
			if (config['move_y'] == true)
			{
				config.top = obj.style.top;
				// position �Ӽ��� ���� top �� ����
				var top = (y - data.y);
				if (obj.style.position == 'relative')
					top = (y - data.d.top - data.y);

				obj.style.top = top + 'px';

				top = null;
			}

			// X�� ������ ����
			if (config['move_x'] == true)
			{
				config.left = obj.style.left;
				// position �Ӽ��� ���� left �� ����
				var left = (x - data.x);
				if (obj.style.position == 'relative')
					left = (x - data.d.left - data.x);

				obj.style.left = left + 'px';

				left = null;
			}

			// �������� ������ ���� ���� �ʱ�ȭ
			if (config['move_area_x'] != true)
				config['move_area_x'] = true;

			if (config['move_area_y'] != true)
				config['move_area_y'] = true;

			var bXArea = (drag.dragXData[obj.id] != null);
			var bYArea = (drag.dragYData[obj.id] != null);

			// drag.setMoveArea() �Լ��� ��ü�� �̵� ������ ������ ���
			if (drag.moveAreaObj[obj.id] != null)
			{
				// �巡�� ��ü�� ������ ���� �ȿ� �ִ����� �˻�
				var oData = e.getBounds(obj.id);
				var mData = e.getBounds(drag.moveAreaObj[obj.id]);
				if (mData.left > oData.left || mData.left + mData.width < oData.left + oData.width)
					config['move_area_x'] = false;

				if (mData.top > oData.top || mData.top + mData.height < oData.top + oData.height)
					config['move_area_y'] = false;
			}

			// drag.setXMoveArea(), drag.setYMoveArea() �Լ��� ��ü�� �̵� ������ ������ ���
			if (bXArea == true || bYArea == true)
			{
				var mData = new Object();
				if (bXArea == true)
				{
					var sx = drag.dragXData[obj.id]['start'];
					var ex = drag.dragXData[obj.id]['exit'];

					// �巡�� ��ü�� ������ ���� �ȿ� �ִ����� �˻�
					var oData = e.getBounds(obj.id);

					mData.left = sx;
					mData.width = ex - sx;

					if (mData.left > oData.left || mData.left + mData.width < oData.left + oData.width)
						config['move_area_x'] = false;

					sx = null;
					ex = null;
				}

				if (bYArea == true)
				{
					var sy = drag.dragYData[obj.id]['start'];
					var ey = drag.dragYData[obj.id]['exit'];

					// �巡�� ��ü�� ������ ���� �ȿ� �ִ����� �˻�
					var oData = e.getBounds(obj.id);

					mData.top = sy;
					mData.height = ey - sy;

					if (mData.top > oData.top || mData.top + mData.height < oData.top + oData.height)
						config['move_area_y'] = false;

					sy = null;
					ey = null;
				}
			}

			// Y���� ������ ����
			if (config['move_y'] == true)
			{
				if (config['move_area_y'] == false)
				{
					if (mData != null && oData != null)
					{
						if (mData.top > oData.top)
							obj.style.top = mData.top + 'px';
						else if (mData.top + mData.height < oData.top + oData.height)
							obj.style.top = (mData.top + mData.height - oData.height) + 'px';
					}
					else
					{
						obj.style.top = config.top;
					}
				}
			}

			// X���� ������ ����
			if (config['move_x'] == true)
			{
				if (config['move_area_x'] == false)
				{
					if (mData != null && oData != null)
					{
						if (mData.left > oData.left)
							obj.style.left = mData.left + 'px';
						else if (mData.left + mData.width < oData.left + oData.width)
							obj.style.left = (mData.left + mData.width - oData.width) + 'px';
					}
					else
					{
						obj.style.left = config.left;
					}
				}
			}

			oData = null;
			mData = null;
			x = null;
			y = null;
			data = null;
			config = null;

			// ���� �̺�Ʈ�� �����ϴ� �Լ� ����
			if (typeof drag.dragFunc['play' + obj.id] != 'undefined')
				drag.dragFunc['play' + obj.id](obj);
		}
	},

	// �巡�� ���� ���� �Լ�
	//
	// ��� : drag.d_exit(event ��ü, object);
	d_exit : function(event, obj)
	{
		if (drag.dragState[obj.id] == 'play')
		{
			drag.dragState[obj.id] = '';
			if (typeof drag.areaObj[obj.id] != 'undefined')
			{
				var areaData = e.getBounds(drag.areaObj[obj.id]);
				var dragData = e.getBounds(obj.id);
				// dragData
				var dx = dragData.left;
				var dX = dragData.left + dragData.width;
				var dy = dragData.top;
				var dY = dragData.top + dragData.height;
				// areaData
				var ax = areaData.left;
				var aX = areaData.left + areaData.width;
				var ay = areaData.top;
				var aY = areaData.top + areaData.height;

				if ((dy >= ay && dy <= aY && dx >= ax && dx <= aX) ||	// left		top
					(dY >= ay && dY <= aY && dX >= ax && dX <= aX) ||	// right	bottom
					(dY >= ay && dY <= aY && dx >= ax && dx <= aX) ||	// left		bottom
					(dy >= ay && dy <= aY && dX >= ax && dX <= aX))		// right	top
				{
					// �ش� ��ü�� �������� �ö������ �����ϴ� �Լ� ����
					if (typeof drag.dragFunc['area' + obj.id] != 'undefined')
					{
						drag.dragState[obj.id] = 'over';
						drag.dragFunc['area' + obj.id](obj);
					}
				}
			}

			// ���� �̺�Ʈ�� �����ϴ� �Լ� ����
			if (typeof drag.dragFunc['exit' + obj.id] != 'undefined')
				drag.dragFunc['exit' + obj.id](obj);
		}
	}
};

// ��ü ũ������ ���� Namespace
var resize = {
	// resize ��ü �ε���
	nIndex : -1,
	// resize ��ü
	sizeObj : new Array(),
	// resize ��ü�� �ε���
	sizeIndex : new Array(),
	// resize ��ü�� ����
	sizeState : new Array(),
	// resize ���� �Լ� ����
	sizeFunc : new Array(),
	// resize ������ �ִ� ũ�Ⱚ
	maxSize : new Array(),
	// resize ���� ȯ�溯��
	config : new Array(),

	// resize ��ü ���
	// width, height �� ũ�⸦ ��� ����
	//
	// ��� : resize.setResize(string);
	setResize : function(obj)
	{
		// ��ü ���翩�� �˻�
		var o = e.$g(obj);
		if (o == null)
		{
			alert('resize.setResize() : `' + obj + '` ��ü�� ã�� �� �����ϴ�.');
			return false;
		}

		// ũ������ ��ü���
		this.nIndex++;
		this.sizeObj[this.nIndex] = obj;
		this.sizeIndex[obj] = this.nIndex;
		this.sizeState[obj] = 'ready';

		this.resizeStart(o);
		this.resizeExit(o);

		this.setResizeWidth(-1);
		this.setResizeHeight(-1);
	},

	// resize ũ������ ��� ����
	// width, height ���� �ϳ��� ���� �����ϵ��� �ϴ� �Լ�
	//
	// ��� : resize.setResizeType(string);
	//				w �϶� ���θ�, h �϶� ���θ� ũ�������� �����մϴ�.
	setResizeType : function(cType)
	{
		var obj = this.sizeObj[this.nIndex];
		if (obj == null)
		{
			alert('resize.setResizeType() �Լ��� ����ϱ� ���� resize.setResize() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.config[obj] = new Array();
		this.config[obj]['sizeType'] = cType;
	},

	// resize ������ �ִ� width �� ����
	//
	// ��� : resize.setResizeWidth(int);
	setResizeWidth : function(nMaxSize)
	{
		var obj = this.sizeObj[this.nIndex];
		if (obj == null)
		{
			alert('resize.setResizeWidth() �Լ��� ����ϱ� ���� resize.setResize() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		if (this.maxSize[obj] == null)
		{
			this.maxSize[obj] = new Array();
			this.maxSize[obj]['height'] = 0;
		}

		this.maxSize[obj]['width'] = nMaxSize;
	},

	// resize ������ �ִ� height �� ����
	//
	// ��� : resize.setResizeHeight(int);
	setResizeHeight : function(nMaxSize)
	{
		var obj = this.sizeObj[this.nIndex];
		if (obj == null)
		{
			alert('resize.setResizeHeight() �Լ��� ����ϱ� ���� resize.setResize() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		if (this.maxSize[obj] == null)
		{
			this.maxSize[obj] = new Array();
			this.maxSize[obj]['width'] = 0;
		}

		this.maxSize[obj]['height'] = nMaxSize;
	},

	// resize ���۵ɶ� �����ϴ� �Լ� ���
	//
	// ��� : resize.startFunction(function);
	startFunction : function(func)
	{
		if (this.sizeObj[this.nIndex] == null)
		{
			alert('resize.startFunction() �Լ��� ����ϱ� ���� resize.setResize() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.sizeFunc['start' + this.sizeObj[this.nIndex]] = func;
	},

	// resize �������϶� �����ϴ� �Լ� ���
	//
	// ��� : resize.playFunction(function);
	playFunction : function(func)
	{
		if (this.sizeObj[this.nIndex] == null)
		{
			alert('resize.playFunction() �Լ��� ����ϱ� ���� resize.setResize() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.sizeFunc['play' + this.sizeObj[this.nIndex]] = func;
	},

	// resize ����ɶ� �����ϴ� �Լ� ���
	//
	// ��� : resize.exitFunction(function);
	exitFunction : function(func)
	{
		if (this.sizeObj[this.nIndex] == null)
		{
			alert('resize.exitFunction() �Լ��� ����ϱ� ���� resize.setResize() �Լ��� �巡�� ��ü�� ����Ͽ��� �մϴ�.');
			return false;
		}

		this.sizeFunc['exit' + this.sizeObj[this.nIndex]] = func;
	},

	// resize ���� �̺�Ʈ ��� �Լ�
	//
	// ��� : resize.resizeStart(object);
	resizeStart : function(obj)
	{
		e.event(obj, 'click', resize.r_start);
	},

	// resize ���� �̺�Ʈ ��� �Լ�
	//
	// ��� : resize.resizeExit(object);
	resizeExit : function(obj)
	{
		e.event(document.documentElement, 'click', function(event){ resize.r_exit(event, obj); });
	},

	// ũ������ ���� �Լ�
	//
	// ��� : resize.r_exit(event ��ü, object);
	r_exit : function(event, obj)
	{
		if (resize.sizeState[obj.id] != 'ready')
		{
			var data = e.getBounds(obj.id);
			var nX = event.clientX + document.documentElement.scrollLeft;
			var nY = event.clientY + document.documentElement.scrollTop;
			var x = data.left;
			var y = data.top;
			var w = data.width;
			var h = data.height;
			var bClicked = (nX >= x && nX <= (x + w) &&
							nY >= y && nY <= (y + h));

			// ũ������ ��ü�̿��� ������ Ŭ���� ���
			if (bClicked == false)
			{
				// ũ������ ���� ��ü ����
				e.$d(obj.id + '_reRight');
				e.$d(obj.id + '_reBottom');
				e.$d(obj.id + '_reBoth');

				// ���� ����
				resize.sizeState[obj.id] = 'ready';

				// resize ����� ����
				if (typeof resize.sizeFunc['exit' + obj.id] != 'undefined')
					resize.sizeFunc['exit' + obj.id](obj);
			}
		}
	},

	// ũ������ ���� �Լ�
	//
	// ��� : resize.r_start([event ��ü]);
	r_start : function(event)
	{
		var obj = event.target;
		var fOpt = 'cssFloat';
		if (e.isIE() == true)
		{
			obj = event.srcElement;
			fOpt = 'styleFloat';
		}

		// ũ�������� �������� ������ ���
		if (resize.sizeState[obj.id] != 'play')
		{
			// ���� ����
			resize.sizeState[obj.id] = 'play';

			var data = e.getBounds(obj.id);

			// ��ü ũ�� �ʱ�ȭ
			obj.style.width = data.width + 'px';
			obj.style.height = data.height + 'px';

			// ũ�� ������ ���� �Լ� ����
			var sizeType = null;
			if (resize.config[obj.id] != null)
				sizeType = resize.config[obj.id]['sizeType'];

			// ���θ� ũ�� ����
			if (sizeType == 'w' || resize.config[obj.id] == null)
				resize.r_rightBar(obj, data, fOpt);

			// ���θ� ũ������
			if (sizeType == 'h' || resize.config[obj.id] == null)
				resize.r_bottomBar(obj, data, fOpt);

			// ���� ���� ũ�� ����
			if (resize.config[obj.id] == null)
				resize.r_bothBar(obj, data, fOpt);

			// resize ���۽� ����
			if (typeof resize.sizeFunc['start' + obj.id] != 'undefined')
				resize.sizeFunc['start' + obj.id](obj);
		}
	},

	// ������ ũ�� ������ ����
	//
	// ��� : resize.r_rightBar(object, e.getBounds ��ü, (styleFloat | cssFloat));
	r_rightBar : function(obj, data, fOpt)
	{
		if (e.$g(obj.id + '_reRight') == null)
		{
			// RightBar
			var RightReSize = e.$c('div');
			RightReSize.id = obj.id + '_reRight';
			if (resize.config[obj.id] == null)
			{
				RightReSize.style.borderBottom = 0;
			}
			else
			{
				data.height = data.height - 2;
			}
			RightReSize.style.width = 8 + 'px';
			RightReSize.style.height = data.height + 'px';
			RightReSize.style.top = data.top + 'px';
			RightReSize.style.left = data.left + data.width + 'px';
			RightReSize.className = 'reRight';
			//obj.style[fOpt] = 'left';
			obj.parentNode.appendChild(RightReSize);

			var maxWidth = resize.maxSize[obj.id]['width'];
			var rightData = e.getBounds(obj.id + '_reRight');

			// �巡�� ���� �̺�Ʈ ����
			drag.setDrag(obj.id + '_reRight');
			drag.setMove(true, false);
			if (maxWidth >= 0)
				drag.setXMoveArea(data.left, data.left + maxWidth + rightData.width);
			drag.startFunction(function(o) {
				resize.sizeState[obj.id] = 'x_resize_start';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.playFunction(function(o) {
				resize.sizeState[obj.id] = 'x_resize_play';

				// �̵��� ���� ũ�� �������� ����/���� ���� ����
				var odata = e.getBounds(o.id);
				var bobj = e.$g(obj.id + '_reBottom');
				var btobj = e.$g(obj.id + '_reBoth');
				var objData = e.getBounds(obj.id);

				// ��ü ũ�� ����
				var objWidth = (odata.left - objData.left);
				if (objWidth < 0)
				{
					objWidth = 0;
				}
				else if (objWidth > maxWidth && maxWidth >= 0)
				{
					objWidth = maxWidth;
				}

				obj.style.width = objWidth + 'px';
				objData = e.getBounds(obj.id);

				// �Ʒ� / ������ - �Ʒ� ũ������ ���� ũ�� / ��ġ ����
				if (bobj != null)
				{
					bobj.style.width = objWidth + 'px';
					bobj.style.left = objData.left + 'px';
				}

				if (btobj != null)
					btobj.style.left = objData.left + objWidth + 'px';

				o.style.left = objData.left + objWidth + 'px';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.exitFunction(function(o) {
				resize.sizeState[obj.id] = 'x_resize_exit';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
		}
	},

	// �Ʒ��� ũ�� ������ ����
	//
	// ��� : resize.r_bottomBar(object, e.getBounds ��ü, (styleFloat | cssFloat));
	r_bottomBar : function(obj, data, fOpt)
	{
		if (e.$g(obj.id + '_reBottom') == null)
		{
			// BottomBar
			var BottomReSize = e.$c('div');
			BottomReSize.id = obj.id + '_reBottom';
			if (resize.config[obj.id] == null)
			{
				BottomReSize.style.borderRight = 0;
			}
			else
			{
				data.width = data.width - 2;
			}
			BottomReSize.style.width = data.width + 'px';
			BottomReSize.style.height = 8 + 'px';
			BottomReSize.style.top = data.top + data.height + 'px';
			BottomReSize.style.left = data.left + 'px';
			BottomReSize.className = 'reBottom';
			BottomReSize.innerHTML = '';
			obj.parentNode.appendChild(BottomReSize);

			var maxHeight = resize.maxSize[obj.id]['height'];
			var bottomData = e.getBounds(obj.id + '_reBottom');

			// �巡�� ���� �̺�Ʈ ����
			drag.setDrag(obj.id + '_reBottom');
			drag.setMove(false, true);
			// Y�� ������ ����
			if (maxHeight >= 0)
				drag.setYMoveArea(data.top, data.top + maxHeight + bottomData.height);
			drag.startFunction(function(o) {
				resize.sizeState[obj.id] = 'y_resize_start';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.playFunction(function(o) {
				resize.sizeState[obj.id] = 'y_resize_play';

				// �̵��� ���� ũ�� �������� ����/���� ���� ����
				var odata = e.getBounds(o.id);
				var robj = e.$g(obj.id + '_reRight');
				var bobj = e.$g(obj.id + '_reBoth');
				var objData = e.getBounds(obj.id);

				// ��ü ũ�� ����
				var objHeight = (odata.top - objData.top);
				if (objHeight < 0)
				{
					objHeight = 0;
				}
				else if (objHeight > maxHeight && maxHeight >= 0)
				{
					objHeight = maxHeight;
				}

				obj.style.height = objHeight + 'px';
				objData = e.getBounds(obj.id);

				// ���� �� ��� ó��
				// ������ / ������ - �Ʒ� ũ������ ���� ũ�� / ��ġ ����
				if (robj != null)
				{
					robj.style.height = objHeight + 'px';
					robj.style.top = objData.top + 'px';
				}

				if (bobj != null)
					bobj.style.top = objData.top + objHeight + 'px';

				o.style.top = objData.top + objHeight + 'px';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.exitFunction(function(o) {
				resize.sizeState[obj.id] = 'y_resize_exit';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
		}
	},

	// ������ - �Ʒ� ũ�� ������ ����
	//
	// ��� : resize.r_bothBar(object, e.getBounds ��ü, (styleFloat | cssFloat));
	r_bothBar : function(obj, data, fOpt)
	{
		if (e.$g(obj.id + '_reBoth') == null)
		{
			// BothBar
			var BothReSize = e.$c('div');
			BothReSize.id = obj.id + '_reBoth';
			BothReSize.style.width = 9 + 'px';
			BothReSize.style.height = 9 + 'px';
			BothReSize.style.top = data.top + data.height + 'px';
			BothReSize.style.left = data.left + data.width + 'px';
			BothReSize.className = 'reBoth';
			obj.parentNode.appendChild(BothReSize);

			var maxWidth = resize.maxSize[obj.id]['width'];
			var maxHeight = resize.maxSize[obj.id]['height'];
			var bothData = e.getBounds(obj.id + '_reBoth');

			// �巡�� ���� �̺�Ʈ ����
			drag.setDrag(obj.id + '_reBoth');
			// X, Y�� ũ�� ����
			if (maxWidth >= 0)
				drag.setXMoveArea(data.left, data.left + maxWidth + bothData.width);
			if (maxHeight >= 0)
				drag.setYMoveArea(data.top, data.top + maxHeight + bothData.height);
			drag.startFunction(function(o) {
				resize.sizeState[obj.id] = 'xy_resize_start';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.playFunction(function(o) {
				resize.sizeState[obj.id] = 'xy_resize_play';

				// �̵��� ���� ũ�� �������� ����/���� ���� ����
				var odata = e.getBounds(o.id);
				var objData = e.getBounds(obj.id);
				var robj = e.$g(obj.id + '_reRight');
				var h = odata.top - objData.top;//e.getPx(o, 'top', 'px') - e.getPx(robj, 'top', 'px');
				var bobj = e.$g(obj.id + '_reBottom');
				var w = odata.left - objData.left;//e.getPx(o, 'left', 'px') - e.getPx(bobj, 'left', 'px');

				// ������ ũ�� �̻����δ� ���� �Ұ��� �ϵ���
				if (h > maxHeight && maxHeight >= 0)
					h = maxHeight;
				else if (h < 0)
					h = 0;

				if (w > maxWidth && maxWidth >= 0)
					w = maxWidth;
				else if (w < 0)
					w = 0;

				// ����, ���ΰ��� �����϶� ó��
				// ������ / �Ʒ� ũ������ ���� ũ�� / ��ġ ����
				robj.style.height = h + 'px';
				bobj.style.width = w + 'px';

				// �̹��� ũ�� ����
				obj.style.width = w + 'px';
				obj.style.height = h + 'px';

				var objData = e.getBounds(obj.id);

				if (h >= 0)
				{
					bobj.style.top = objData.top + h + 'px';//o.style.top;
					bobj.style.left = objData.left + 'px';//o.style.left;
				}

				if (w >= 0)
				{
					robj.style.top = objData.top + 'px';//o.style.top;
					robj.style.left = e.getPx(bobj, 'left', 'px') + e.getPx(bobj, 'width', 'px') + 'px';//o.style.left;
				}

				o.style.top = objData.top + h + 'px';
				o.style.left = objData.left + w + 'px';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.exitFunction(function(o) {
				resize.sizeState[obj.id] = 'xy_resize_exit';

				// ũ�� �������ϋ� ����
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
		}
	}
};

// Ajax ���� Namespace
var ajax = {
	// Create Ajax Object
	create : function()
	{
		try { return new ActiveXObject("Msxml2.XMLHTTP");    } catch(e) {} //IE6
		try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {} //IE5.5
		try { return new XMLHttpRequest();                   } catch(e) {} //IE7, Firefox
		return false;
	},

	// ajax.get(string[, function[, function]]);
	//
	// url : GET������ �ּ�
	//		 ��) index.html?get1=data1&get2=data2&get3=data3
	// playFunc : ������ �Լ�
	//			- [��������] xmlhttp��ü�� �Ű������� �޽��ϴ�.
	// loadingFunc : �ε����϶� �����ϴ� �Լ�
	//			- [��������] xmlhttp��ü�� �Ű������� �޽��ϴ�.
	get : function(url, playFunc, loadingFunc)
	{
		var xmlhttp = this.create();
		var urlData = url.split('?');
		var sUrl = urlData[0];
		if (urlData[1] != null)
			var sData = '?' + urlData[1].split('&amp;').join('&');
		else
			var sData = '';

		xmlhttp.open('GET', sUrl + encodeURI(sData), true);
		xmlhttp.send(null);
		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == '4')
			{
				if(xmlhttp.status == 200)
				{
					// xmlhttp.responseText
					if (typeof playFunc != 'undefined')
						playFunc(xmlhttp);
				}
			}
			else
			{
				// �ε��� ǥ��
				if (typeof loadingFunc != 'undefined')
					loadingFunc(xmlhttp);
			}
		};
	},

	// ajax.post(string[, function[, function]]);
	//
	// url : POST������ �ּ�
	//		 ��) index.html?get1=data1&get2=data2&get3=data3
	// playFunc : ������ �Լ�
	//			- [��������] xmlhttp��ü�� �Ű������� �޽��ϴ�.
	// loadingFunc : �ε����϶� �����ϴ� �Լ�
	//			- [��������] xmlhttp��ü�� �Ű������� �޽��ϴ�.
	post : function(url, playFunc, loadingFunc)
	{
		var xmlhttp = this.create();
		var urlData = url.split('?');
		var sUrl = urlData[0];
		if (urlData[1] != null)
			var sData = urlData[1].split('&amp;').join('&');
		else
			var sData = '';

		xmlhttp.open('POST', sUrl, true);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send(encodeURI(sData));
		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == '4')
			{
				if(xmlhttp.status == 200)
				{
					// xmlhttp.responseText
					if (typeof playFunc != 'undefined')
						playFunc(xmlhttp);
				}
			}
			else
			{
				// �ε��� ǥ��
				if (typeof loadingFunc != 'undefined')
					loadingFunc(xmlhttp);
			}
		};
	}
};

var swf = {
	params : '',
	addParams : '',
	addURL : '',
	// html code return
	add : function(id, src, w, h) {
		src += '?' + this.addURL;
		var str =	'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + w + '" height="' + h + '" id="' + id + '" align="middle">' +
					'	<param name="allowScriptAccess" value="always" />' +
					'	<param name="allowFullScreen" value="false" />' +
					'	<param name="movie" value="' + src + '" />' +
					'	<param name="quality" value="high" />' +
					'	<param name="wmode" value="transparent" />' +
					'	<param name="bgcolor" value="#ffffff" />' + this.params +
					'	<embed src="' + src + '" ' + this.addParams + 'quality="high" wmode="transparent" bgcolor="#ffffff" width="' + w + '" height="' + h + '" name="' + id + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />' +
					'</object>';
		return str;
	},

	// document object return
	// add <object>
	addObject : function(id, src, w, h)
	{
		var object = e.$c('object');
			object.setAttribute('classid', 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000');
			object.setAttribute('cidebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0');
			object.setAttribute('width', w);
			object.setAttribute('height', h);
			object.setAttribute('align', 'middle');
			object.appendChild(this.setParam('allowScriptAccess', 'always'));
			object.appendChild(this.setParam('allowFullScreen', 'false'));
			object.appendChild(this.setParam('movie', src));
			object.appendChild(this.setParam('quality', 'high'));
			object.appendChild(this.setParam('wmode', 'transparent'));
			object.appendChild(this.setParam('bgcolor', '#ffffff'));
			object.appendChild(this.setEmbed(id, src, w, h));
		return object;
	},

	setParams : function(str)
	{
		this.addURL = str;
		this.addParams = '';
		this.params = '';
		var exVal = str.split('&');
		for(var i = 0; i < exVal.length; i++)
		{
			var exValex = exVal[i].split('=');
			var name = exValex[0];
			var value = exValex[1];

			this.params += '<param name="' + name + '" value="' + value + '" />';
			this.addParams += name + '="' + value + '" ';
		}
	},

	// add <param>
	setParam : function(k, v)
	{
		var param = e.$c('param');
			param.name = k;
			param.value = v;
		return param;
	},

	// add <embed>
	setEmbed : function(id, src, w, h)
	{
		var embed = e.$c('embed');
			embed.setAttribute('src', src);
			embed.setAttribute('quality', 'high');
			embed.setAttribute('wmode', 'transparent');
			embed.setAttribute('bgcolor', '#ffffff');
			embed.setAttribute('width', w);
			embed.setAttribute('height', h);
			embed.setAttribute('name', id);
			embed.setAttribute('align', 'middle');
			embed.setAttribute('allowScriptAccess', 'always');
			embed.setAttribute('allowFullScreen', 'false');
			embed.setAttribute('type', 'application/x-shockwave-flash');
			embed.setAttribute('pluginspage', 'http://www.macromedia.com/go/getflashplayer');
		return embed;
	}
};
