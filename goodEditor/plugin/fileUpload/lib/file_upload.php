<?php
?>
<!--
/**
 * CopyRight (C) WSCSX.COM. All Rights Reserved.
 *
 * ������ : �躴��
 * Ȩ������ : http://www.wscsx.com/
 * ���̼��� : http://www.wscsx.com/license.php
 * �̸��� : quddnr145@naver.com
 * ���� : ���۱� ���úκ��� �������� ���ð� ����Ͻñ� �ٶ��ϴ�.
 **/
 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=euc-kr" />
	<title> ���� ���ε� - GoodEditor </title>
	<script type="text/javascript" src="../../../goodEditor.js"></script>
	<style type="text/css">
		div.inputfile { position:relative; }
		div.inputfack { position:absolute; top:0px; left:0px; z-index:1; height:100%; }
		.file { position:relative; top:0px; left:0px; z-index:2; width:350px; text-align:right; }
	</style>
</head>
<body>

<?php
if (isset($_FILES['file_upload'])) {
	$file		= $_FILES['file_upload']['tmp_name'];
	$fileName	= $_FILES['file_upload']['name'];
	
	if ($fileName) {
		// ���� ���ε� ó��
		$fileNameE = strrev($fileName);
		$fileNameX = explode('.', $fileNameE);
		$fileNa = strrev($fileNameX[1]);
		$fileEx = strtolower(strrev($fileNameX[0]));

		$fileSize = filesize($file);
		$mkdir = '../../../upload/';

		// Ȯ���� ���͸� ó��
		switch ($fileEx) {
		case 'htaccess':
		case 'ini':
		case 'conf':
			?>
			<script type="text/javascript">
			//<![CDATA[
				alert('���ε� ������ �������� �ʽ��ϴ�.');
				history.go(-1);
			//]]
			</script>
			<?php
			exit;
			break;
		}
		if (!file_exists($mkdir)) {
			?>
			<script type="text/javascript">
			//<![CDATA[
				alert('���ε� ������ �������� �ʽ��ϴ�.');
				history.go(-1);
			//]]
			</script>
			<?php
		} else {
			if (!is_writeable($mkdir)) {
				?>
				<script type="text/javascript">
				//<![CDATA[
					alert('���ε� ������ ��������� �ο��� �� �����ϴ�.');
					history.go(-1);
				//]]
				</script>
				<?php
			} else {
				if ($fileSize <= 0)
				{
					?>
					<script type="text/javascript">
					//<![CDATA[
						alert('10MB ������ ���ϸ� ���ε� �� �� �ֽ��ϴ�.');
						history.go(-1);
					//]]
					</script>
					<?php
				} else {
					// ���ε� �� ������ ���
					if (is_uploaded_file($file)) {
						// ���� ���ε�
						move_uploaded_file($file, $mkdir.$fileNa.'.'.$fileEx);
					}
					?>
					<script type="text/javascript">
					//<![CDATA[
						top.opener.goodEditor.upload.addList('<?php echo $fileNa.'.'.$fileEx; ?>', '<?php echo $fileSize; ?> B', 'file');
						window.close();
					//]]
					</script>
					<?php
				}
			}
		}
	}
}
?>

	<!-- ���� -->
	<div style="background:#ff7200 url(../../../images/layout_header_bg.jpg) repeat-x left top; color:#fff; padding:8px; font-size:12px; border:1px solid #ff9966;">
		<span style="color:#f8cb0d; font-family:small fonts; font-size:8px;">��</span>&nbsp;&nbsp;&nbsp;���� �ø���
	</div>
	<form id="upload_f" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
		<fieldset style="border:0; background:#eee; margin:5px; border:1px solid #ccc;">
			<div class="inputfile" style="overflow:hidden; height:30px; margin-top:7px; margin-left:17px;">
				<input type="file" id="file_upload" name="file_upload" class="file" value="" style="float:left; width:300px; height:21px;" onchange="e.$g('showFilePath').value=this.value; this.blur();" />
				<div class="inputfack">
					<!-- (w - 75) -->
					<input type="text" id="showFilePath" name="showFilePath" class="input_skin1" value="" style="float:left; width:225px; *height:23px; margin-right:5px; padding:4px; font-size:11px;" />
					<img src="../../../images/filefind_btn.gif" alt="" style="float:left;" />
				</div>
				<script type="text/javascript">
				//<![CDATA[
				var fls = new flash('file_upload');
					fls.alpha.start(0);
				//]]>
				</script>
			</div>
		</fieldset>
		<div style="text-align:center; padding:3px;">
			�ִ� 10M������ ���ε� �ϽǼ� �ֽ��ϴ�.
			<div style="margin-top:10px;">
				<input type="image" src="../../../images/ok_btn.gif" alt="Ȯ��" />
				<a href="#." onclick="window.close();"><img src="../../../images/no_btn.gif" alt="���" /></a>
			</div>
		</div>
	</form>

</body>
</html>
