<?php
	$selected = getor($_GET['selected'],-1);
	$current_item = $selected!=-1?nai_alarm_getalarm($selected):null;
	$action = getor($_POST['action'],'none');
	global $zd, $vl,$js;
	include_plugin('maskedinput');

	switch($action){
		case 'submit':
			$name = getor($_POST['text-name'],'none');
			$alarm_for = getor($_POST['select-alarm_for']);
			$alarm_value = getor($_POST['select-'.$alarm_for]);
			$tre_type = getor($_POST['select-tretype']);
			$tre_value = getor($_POST['text-'.$tre_type]);
			$alarm_dst_phone = getor($_POST['select-alarm_dst_phone']);
			$alarm_dst_device = ''; //$alarm_dst_device = getor($_POST['alarm_dst_device']);
			$active = getor($_POST['checkbox-active'])=='on'?'1':'0';
			$goto = getor($_POST['goto0']);
			$goto_value = getor($_POST[$goto.'0']);

			//print_r($active);

			$gotos = array(
				getor($_POST[ getor($_POST['goto0']).'0']),
				getor($_POST[ getor($_POST['goto1']).'1']),
				getor($_POST[ getor($_POST['goto2']).'2']),
				getor($_POST[ getor($_POST['goto3']).'3'])
			);
			$goto_nexts = getor( $_POST['goto_next'] );

			//print_r( $gotos );
			//print_r( $goto_nexts );

			if($selected==-1){ // add alarm
				nai_add_alert( nai_alarm_insert($name,$alarm_for,$alarm_value,$tre_type,$tre_value,$alarm_dst_phone,$alarm_dst_device,$active,$goto,$goto_value,  $gotos, $goto_nexts) );
				//$selected = mysql_insert_id();
				$selected = -1;
				$current_item = null;

				$js->addressBar("config.php?display=alarm");
			}
			else{ // update alarm
				nai_add_alert( nai_alarm_update($selected, $name,$alarm_for,$alarm_value,$tre_type,$tre_value,$alarm_dst_phone,$alarm_dst_device,$active,$goto,$goto_value,   $gotos, $goto_nexts) );
				$current_item = nai_alarm_getalarm($selected);
			}

			//$js->return_form($_POST);
			break;
		case 'delete':
			nai_add_alert( nai_alarm_delete($selected) );
			$selected=-1;
			$current_item=null;
			$js->addressBar("config.php?display=alarm");
			break;

	}
?>

<script>
	$(function(){
		$('[name=tretime]').mask('99:99:99');

		$('[name="select-alarm_for"]').change(function(){
			var x = $(this).val();
			$('[for="alarm_for"]').hide();
			$('[for="alarm_for"][for2="'+x+'"]').show();
		}).change();

		$('[name="select-tretype"]').change(function(){
			var x = $(this).val();
			$('[for="tretype"]').hide();
			$('[for="tretype"][for2="'+x+'"]').show();
		}).change();
	});
</script>

<h2> هشدار ها </h2>

<div class="rnav">
	<ul>
		<?php nai_alarm_getalarms_as_rnav($selected) ?>
	</ul>
</div>

<form method="post">
	<table class="nai_table conf_table">
		<tr class="title">
			<td colspan="2">
				<h5> تنظیمات عمومی </h5> <hr>
			</td>
		</tr>
		<tr>
			<td>
				نام هشدار
			</td>
			<td>
				<input type="text" name="text-name" required/>
			</td>
		</tr>
		<tr>
			<td>
				موضوع هشدار
			</td>
			<td>
				<select name="select-alarm_for" class="chosen">
					<option value="queue"> صف </option>
					<option value="trunk"> ترانک </option>
				</select>
			</td>
		</tr>
		<tr for="alarm_for" for2="queue">
			<td>
				انتخاب صف
			</td>
			<td>
				<select name="select-queue" class="chosen" for="alarm_for">
					<option value="">---</option>
					<?php
						$queues = nai_queues_getqueues();
						foreach($queues as $queue){
							echo "<option value=\"$queue[extension]\"> $queue[extension] </option>";
						}
					?>
				</select>
			</td>
		</tr>
		<tr for="alarm_for" for2="trunk">
			<td>
				انتخاب ترانک
			</td>
			<td>
				<select name="select-trunk" class="chosen" for="alarm_for">
					<option value="">---</option>
					<?php
						$trunks = nai_users_gettrunks();
						foreach($trunks as $trunk){
							echo "<option value=\"$trunk[trunkid]\"> $trunk[name] </option>";
						}
					?>
				</select>
			</td>
		</tr>
		<tr>
			<td>
				میزان آستانه
			</td>
			<td>
				<select name="select-tretype" class="chosen">
					<option value="time"> طول زمان </option>
					<option value="count"> تعداد </option>
				</select>
			</td>
		</tr>
		<tr for="tretype" for2="time">
			<td>
				طول زمان
			</td>
			<td>
				<input name="text-time" type="text" value="00:00:00" pattern="<?php echo $vl->pattern('counttime'); ?>"/>
			</td>
		</tr>
		<tr for="tretype" for2="count">
			<td>
				تعداد
			</td>
			<td>
				<input name="text-count" type="text"/>
			</td>
		</tr>
		<tr>
			<td>
				فعال
			</td>
			<td>
				<input name="checkbox-active" type="checkbox" />
			</td>
		</tr>

		<tr class="title">
			<td colspan="2">
				<h5> مقصد هشدار دهی </h5> <hr>
			</td>
		</tr>
		<tr>
			<td>
				مقصد هشدار دهی (تلفن)
			</td>
			<td>
				<select name="select-alarm_dst_phone" class="chosen">
					<option value="">---</option>
					<?php
						$extensions = nai_users_getextensions();
						foreach($extensions as $extension){
							echo "<option value=\"$extension[extension]\"> $extension[name] - $extension[extension] </option>";
						}
					?>
				</select>
			</td>
		</tr>
		<tr>
			<td>
				مقصد هشدار دهی (دستگاه)
			</td>
			<td>
				<select name="alarm_dst_device" class="chosen" disabled>
					<option value="">---</option>
				</select>
			</td>
		</tr>
		<tr class="title">
			<td colspan="2">
				<h5> مقصد بعدی </h5> <hr>
			</td>
		</tr>
		<?php for( $i = 0; $i <= 3; $i++ ){ ?>
		<tr class="s_remove">
			<td>
				<?php echo drawselects($selected!=-1?$current_item['goto'. $i]:null, $i); ?>
			<td>
				<input value="<?php echo getor( $current_item['goto'. $i . '_next'], 0); ?>" class="goto_next" name="goto_next[<?php echo $i; ?>]" placeholder="حداکثر تعداد" type="number" style="position: absolute;margin-right: 217px;height: 37px !important;"/>
			</td>
		</tr>
		<?php } ?>
		<tr>
			<td colspan="2"> <a id="add_goto" class="likebutton lightbutton">+</a> | <a id="remove_goto" class="likebutton lightbutton">-</a> </td>
		</tr>
		<tr class="title">
			<td colspan="2">
				<button type="submit" name="action" value="submit"> ثبت </button>
				<?php if($selected!='-1') { ?> | <button class="delete" type="submit" name="action" value="delete">حذف</button> <?php } ?>
			</td>
		</tr>
	</table>
</form>

<script>
	$('.goto_next').each( function( i ){
		var mytr = $(this).parent('td').parent('tr');
		$(this).appendTo( mytr.prev('tr').children('td') );
		mytr.prev('tr').addClass('goto_tr');
		mytr.addClass('s_remove');
	} );

	$('.goto_tr').each( function(i){
		var val =  $(this).find('.destdropdown').val();
		if( !val ) $(this).hide();
	});
	$('#add_goto').click( function(){
		var trs = $('.goto_tr');
		for( var i = 0; i < trs.length; i++ ){
			if( ! trs.eq(i).is(":visible") ){
				trs.eq(i).show();
				break;
			}
		}
	});


	$('#remove_goto').click( function(){
		//alert('clicked');
		var brk = false;
		var trs = $('.goto_tr');
		for( var i = trs.length-1; i > -1; i-- ){
			if( trs.eq(i).is(":visible") ){
				trs.eq(i).find('.destdropdown').val('').change();
				trs.eq(i).find('.goto_next').val('0').change();
				trs.eq(i).hide();
				break;
			}
		}
	});
	$('.s_remove').remove();
</script>

<?php
	if($selected != -1) {
?>
	<script>
		$('[name="text-name"]').val('<?php echo $current_item['name']; ?>');
		$('[name="select-alarm_for"]').children('[value="<?php echo $current_item['alarm_for']; ?>"]').attr('selected','selected').change();
		$('[name="select-<?php echo $current_item['alarm_for']; ?>"]').children('[value="<?php echo $current_item['alarm_value']; ?>"]').attr('selected','selected').change();

		$('[name="select-tretype"]').children('[value="<?php echo $current_item['tre_type']; ?>"]').attr('selected','selected').change();
		$('[name="text-<?php echo $current_item['tre_type']; ?>"]').val('<?php echo $current_item['tre_value']; ?>');
		$('[name="select-alarm_dst_phone"]').children('[value="<?php echo $current_item['alarm_dst_phone']; ?>"]').attr('selected','selected').change();
		$('[name="alarm_dst_device"]').children('[value="<?php echo $current_item['alarm_dst_device']; ?>"]').attr('selected','selected').change();
		$('[name="checkbox-active"]').<?php echo $current_item['active']?'attr("checked","checked")':'removeAttr("checked")'; ?>;

		$('[name="goto0"]').children('[value="<?php echo $current_item['goto']; ?>"]').attr('selected','selected').change();
		$('[name="<?php echo $current_item['goto']; ?>"]').children('[value="<?php echo $current_item['goto_value']; ?>"]').attr('selected','selected').change();
	</script>
<?php
	}
?>
