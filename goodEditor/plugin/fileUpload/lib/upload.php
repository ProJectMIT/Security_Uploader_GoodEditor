<?php
// ��Ƽ ���� ���ε�
foreach ($_FILES as $k=>$v)
{
	if ($v['tmp_name'])
	{
		@move_uploaded_file($v['tmp_name'], '../../../upload/'.$v['name']);
	}
}
?>
