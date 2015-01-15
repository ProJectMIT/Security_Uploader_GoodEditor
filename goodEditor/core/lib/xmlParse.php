<?php
// ��� �÷����ο� ���� xml ���� ������ ����
function getAllPluginInfo($plugin_dir)
{
	$xmlData = new xmlParse();

	$_plugin = array();
	$handle = dir($plugin_dir);
	while ($plugin_name = $handle->read())
	{
		switch($plugin_name)
		{
			case '.':
			case '..':
				break;
			default:
				$plugin_full_path = $plugin_dir.'/'.$plugin_name;

				//$plugin_name = substr($plugin_name, 3, strlen($plugin_name) - 3);

				$_plugin[$plugin_name] = array();
				$_plugin[$plugin_name]['error'] = '';

				// plugin �˻�
				if (is_dir($plugin_full_path))
				{
					// ��� ���� �� ��Ÿ ��� ��� ���� xml ���� ��� ����
					$infoXmlPath = $plugin_full_path.'/config/info.xml';
					$moduleXmlPath = $plugin_full_path.'/config/module.xml';
					// ��� ���� �Ľ�
					if (file_exists($infoXmlPath))
					{
						$xmlStr = file_get_contents($infoXmlPath);
						$xmlObj = $xmlData->parse($xmlStr);
						$_plugin[$plugin_name]['info'] = $xmlObj;
						$_plugin[$plugin_name]['info']->error = '';
					}
					else
					{
						$_plugin[$plugin_name]['info']->error = $infoXmlPath.' is not find!!';
					}

					// ��� ��ɿ� ���� ���� �Ľ�
					if (file_exists($moduleXmlPath))
					{
						$xmlStr = file_get_contents($moduleXmlPath);
						$xmlObj = $xmlData->parse($xmlStr);
						$_plugin[$plugin_name]['module'] = $xmlObj;
						$_plugin[$plugin_name]['module']->error = '';
					}
					else
					{
						$_plugin[$plugin_name]['module']->error = $moduleXmlPath.' is not find!!';
					}
				}
				else
				{
					// ��� ���� �ε� ����
					$_plugin[$plugin_name]->error = $plugin_full_path.' is not directory!!';
				}
				break;
		}
	}
	$handle->close();

	return $_plugin;
}

// module.xml ���� �Ľ�
function setXmlModuleData($plugin_dir, &$output, &$selectTap, &$selectTapName)
{
	// ��ġ�� ��� ��� ���� �ε�
	$pluginArr = getAllPluginInfo($plugin_dir);

	$tapIndex = 0;
	$pluginList = '';
	$_pluginArr = array();
	foreach ($pluginArr as $k=>$v)
	{
		// Setting Tap
		if ($v['info']->error != '')
		{
			$tapTitle = '';
		}
		else
		{
			$_pluginArr[] = $k;

			$tapTitle = $v['info']->childNodes['info']->childNodes['plugin']->childNodes['title']->body;
			$tapText = $v['info']->childNodes['info']->childNodes['plugin']->childNodes['description']->body;

			$output .= "this.createTap(".$tapIndex.", '".$k."', '".$tapTitle."', '".$tapText."');\r\n";

			if ($v['module']->error == '')
			{
				foreach ($v['module']->childNodes['module']->childNodes['plugin'] as $vv)
				{
					$pCallback = $vv->attrs['CALLBACK'];
					if ($pCallback != '')
					{
						$pTitle		= $vv->childNodes['title']->body;
						$pDesc		= $vv->childNodes['description']->body;
						$pAction	= $vv->attrs['ACTION'];
						$pShowDesc	= $pAction;
						// �÷����� ��ư ���
						$output .= "this.insertTitleButton('".$pCallback."', '".$pTitle."', '".$pDesc."', null, ".$pAction.", ".$pShowDesc.");\r\n";

						// �ش� Javascript File Include
						if (file_exists($plugin_dir.'/'.$k.'/'.$pCallback.'.js'))
						{
							include $plugin_dir.'/'.$k.'/'.$pCallback.'.js';
						}
					}
					else
					{
						// ���� ���(���м�)
						$output .= "this.insertTitleButton('&nbsp;', '', '', null, false, false);\r\n";
					}
				}
			}
			$tapIndex++;
		}
	}
	// �÷����� ���
	return "'".implode("','", $_pluginArr)."'";
}
?>
