<?php

	function nai_alarm_getalarms(){
		global $nai_db;
		$alarms = $nai_db->querytoarray("SELECT * FROM `alarm`;");
		return $alarms;
	}
	function nai_alarm_insert($name, $alarm_for, $alarm_value, $tre_type, $tre_value, $alarm_dst_phone, $alarm_dst_device, $active, $goto, $goto_value, $goto_values = array(), $goto_nexts = array()){
		global $nai_db;
		$gotos = '';
		if( count( $goto_nexts ) == count( $goto_values ) ){
			foreach( $goto_values as $index=>$value ){
				$gotos.= ", `goto". $index ."` = '". $value ."', `goto". $index . "_next` = " . getor( $goto_nexts[$index], 0 ) ;
			}
		}

		$query = "
			INSERT INTO `alarm`
			SET 
				`name` = '$name',
				`alarm_for` = '$alarm_for',
				`alarm_value` = '$alarm_value',
				`tre_type` = '$tre_type',
				`tre_value` = '$tre_value',
				`alarm_dst_phone` = '$alarm_dst_phone',
				`alarm_dst_device` = '$alarm_dst_device',
				`active` = '$active',
				`goto` = '$goto',
				`goto_value` = '$goto_value'
				$gotos
			;
		";
		$check = $nai_db->query($query);
		return mysql_error()?'اشکال در ایجاد رکورد.\\n'.mysql_error():'هشدار با موفقیت اضافه شد.' ;
	}
	function nai_alarm_update($id,$name,$alarm_for,$alarm_value,$tre_type,$tre_value,$alarm_dst_phone,$alarm_dst_device,$active,$goto,$goto_value, $goto_values = array(), $goto_nexts = array()){
		global $nai_db;
		$gotos = '';
		if( count( $goto_nexts ) == count( $goto_values ) ){
			foreach( $goto_values as $index=>$value ){
				$gotos.= ", `goto". $index ."` = '". $value ."', `goto". $index . "_next` = " . getor( $goto_nexts[$index], 0 ) ;
			}
		}

		$query = "
			UPDATE `alarm`
			SET 
				`name` = '$name',
				`alarm_for` = '$alarm_for',
				`alarm_value` = '$alarm_value',
				`tre_type` = '$tre_type',
				`tre_value` = '$tre_value',
				`alarm_dst_phone` = '$alarm_dst_phone',
				`alarm_dst_device` = '$alarm_dst_device',
				`active` = '$active',
				`goto` = '$goto',
				`goto_value` = '$goto_value'
				$gotos
			WHERE
				`id` = $id
			;
		";
		$check = $nai_db->query($query);
		return mysql_error()?'اشکال در ویرایش رکورد.\\n'.mysql_error():'هشدار با موفقیت ویرایش شد.' ;
	}
	function nai_alarm_getalarm($id){
		global $nai_db;
		$alarm = $nai_db->querytoarray("SELECT * FROM `alarm` WHERE `id` = $id;");
		return $alarm[0];
	}
	function nai_alarm_delete($id){
		global $nai_db;
		$alarm = $nai_db->querytoarray("DELETE FROM `alarm` WHERE `id` = $id;");
		return 'هشدار با موفقیت حدف شد.';
	}
	function nai_alarm_getalarms_as_rnav($current_item){
		$alarms = nai_alarm_getalarms();
		for($i=-1;$i < count($alarms);$i++){
			if($i==-1){
				$link = "?display=alarm";
				$text = 'اضافه کردن هشدار جدید';
			}
			else{
				$link = '?display=alarm&selected='.$alarms[$i]['id'];
				$text = $alarms[$i]['name'];
			}
			$style = 
			( ($current_item == -1 && $i == -1) || ( $current_item == $alarms[$i]['id'] ) ) ? (
				' class="ui-state-highlight ui-corner-all"'
			) : (
				''
			);
			echo "<li $style> <a href=\"$link\"> $text </a></li>";
			$n++;
		}
	}

?>
