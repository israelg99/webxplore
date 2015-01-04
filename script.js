
$(document).ready(function() {
	
	var table = $('body #wrapper #board #files'), // Files table selector.
		fileTR = $('.fileTR'),
		way = []; // Array which will contain the user's way.
	
	// JSON FILES
	addFilesJSON('server');
	// JSON FILES Done!
	
	way.push('server'); // First index value of the user's way is the 'server', this value will stay in first index permanetly.
	
	function addFilesJSON(JSONname) {
		table.html('');
		if(way.length > 1) { table.prepend('<tr class="backTR mouseenterP pointer" style="display:table;width:100%;height:35px;">' +
										   '<th class="backTH"><div style="text-align:center"><a class="a text grey" href="javascript:void(0)">Back</a></div></th>' +
				                           '</tr>'); }
		$.getJSON(JSONname + '.json', function(data) {
			for(var i = 0; i < data.objects.length; i++) {
				var fileName = data.objects[i].name,
					format = CheckFormat(fileName),
					type = CheckType(fileName),
					name = type == 'folder' ? fileName : fileName.substring(0, fileName.lastIndexOf('.')),
					date = data.objects[i].lastModified,
					size = data.objects[i].size;
					if(type === 'text' || type === 'audio' || type === 'video' || type === 'image' || type === 'folder') {
						var img = type;
					} else {
						var img = 'file';
					}
				
				table.append('<tr class="fileTR mouseleave formatSaveHere">' +
						'<th class="nameTH"><label class="text dark"><img style="vertical-align:middle;padding:0px 5px;" src="IMG/' + img + '.png" width="35px" height="30px" />' + name + '</label></th>' +
						'<th class="sizeTH"><label class="text dark">' + size + '</label></th>' +
						'<th class="kindTH"><label class="text dark">' + type + '</label></th>' +
						'<th class="dateTH"><label class="text dark">' + date + '</label></th>' +
					'</tr>');
				
				$('.formatSaveHere .kindTH label').data('format', format);
				
				$('.formatSaveHere').removeClass('formatSaveHere');
			}
		});
	}
	
	function getUserWay(way) {
		var waySTR = "";
		for(var i = 0; i < way.length; i++) {
			waySTR += way[i] == way[0] ? way[i] : "/" + way[i];
		}
		return waySTR;
	}
	
	function PrintSlashURL(way) {
		$('#slashURL label').remove();
		$('#slashHistory table').html('');
		for(var i = 1; i < way.length; i++) {
			$('#slashURL').append('<label class="typo"><span class="darkBlue">/</span><span class="slashWay pointer grey">' + way[i] + '</span></label>');
		}
		if($('#slashURL').height() > 50) {
			$('#dropHistory').show();
			while($('#slashURL').height() > 50) {
				var $this = $('#slashURL label').eq(0),
					name = $this.children('.slashWay').text();
					
				$('#slashHistory table').append(
								'<tr>' +
									'<th class="HistoryTH pointer mouseleaveSlash"><label class="text dark pointer"><img style="vertical-align:middle;padding:0px 5px;" src="IMG/folder.png" width="35px" height="30px" />' + name + '</label></th>' +
								'</tr>');
				
				$this.remove();
			}
		} else {
			$('#dropHistory').hide();
		}
	}
	
	$('#dropHistory').on('click', function(e) {
		var slashHistory = $('#slashHistory');
		slashHistory.slideToggle(300);
		e.stopPropagation();
	});
	
	// Check Type Function
	function CheckType(str) {
		if(str.indexOf('.') === -1) {
			return "folder";
		} else {
			var type = str.substring(str.lastIndexOf('.') + 1, str.length);
			if(type === "txt") { return 'text' }
			else if(type === "mp3" || type === "wma") { return 'audio' }
			else if(type === "mp4" || type === "flv" || type === "avi" || type === "mov" || type === "mpg" || type === "wmv") { return 'video' }
			else if(type === "jpg" || type === "png" || type === "gif" || type === "bmp") { return 'image' }
			else return type;
		}
	}
	// Check Type Function Done!
	
	// Check Format Function
	function CheckFormat(str) {
		if(str.indexOf('.') === -1) {
			return "folder";
		} else {
			return str.substring(str.lastIndexOf('.') + 1, str.length);
		}
	}
	// Check Format Function Done!
	
	// Slash Way Click Event
	$(document).on('click','.slashWay', function() {
		addFilesJSON($(this).text());
		var index = $('#slashURL label').index($(this).parent('label')) + 1,
			tempWay = [];
			
		tempWay[0] = 'server';
		
		if($('#slashHistory table tr').index() === -1 ) {
			for(var i = 1; i <= index; i++) {
				tempWay[i] = way[i];
			}
		} else {
			for(var i = 0; i <= $('#slashHistory table tr').index(); i++) {
				tempWay.push($('#slashHistory table tr').eq(i).children('th').children('label').text());
			}
			for(var i = 0; i < index; i++) {
				tempWay.push($('#slashURL label').eq(i).children('.slashWay').text());
			}
		}
		
		way = tempWay;
		PrintSlashURL(way);
	});
	// Slash Way Click Event Done!
	
	// File TR Events Script .on(hover, click, dblclick)
	$(document).on({
	
		// Hover Event Script
		mouseenter: function () {
			if(!$(this).hasClass('mouseclick')) {
				$('body #wrapper #board #files .fileTR').removeClass('mouseenter mouseenterP').addClass('mouseleave');
				$(this).removeClass('mouseleave').addClass('mouseenter').prev().addClass('mouseenterP');
			}
		},
		mouseleave: function () {
			if(!$(this).hasClass('mouseclick')) {
				$(this).removeClass('mouseenter').addClass('mouseleave').prev().removeClass('mouseenterP');
				$('.backTR').addClass('mouseenterP');
			}
		},
		
		// Click Event Script
		click: function() {
			$('body #wrapper #board #files .fileTR').removeClass('mouseenter mouseenterP mouseclickP mouseclick').children('th').children('label').removeClass('light').addClass('dark');
			$('.backTR').removeClass('mouseclickP').addClass('mouseenterP');
			$(this).removeClass('mouseleave').addClass('mouseclick').prev().addClass('mouseclickP');
			$(this).children('th').children('label').removeClass('dark').addClass('light');
		},
		
		// Double Click (dblclick) Event Script
		dblclick: function() {
			var name = $(this).children('.nameTH').children('label').text(),
			    type = $(this).children('.kindTH').children('label').text(),
				format = $(this).children('.kindTH').children('label').data('format');
			
			if(type === "folder") {
				way.push(name); // Keep pushing values in the way array as the user going into folders.
				addFilesJSON(name);
				PrintSlashURL(way);
				
			} else {
				
				window.open(getUserWay(way) + "/" + name + "." + format);
			}
		}
		// Double Click (dblclick) Event Script Done!

	}, 'body #wrapper #board #files .fileTR');
	// File TR Events Script Done!
	
	// Events with BackTR
	$(document).on({
	
		// Hover Event Script
		mouseenter: function () {
			$('body #wrapper #board #files .fileTR').removeClass('mouseenter mouseenterP').addClass('mouseleave');
			$(this).removeClass('mouseenterP').addClass('mouseenter');
		},
		mouseleave: function () {
			$(this).removeClass('mouseenter').addClass('mouseenterP');
		},
		click: function() {
			way.splice(way.length - 1,1);
			addFilesJSON(way[way.length - 1]);
			PrintSlashURL(way);
		}
	},'.backTR');
	// Events with BackTR Done!
	
	// Events with SlashHistory
	$(document).on({
		
		mouseenter: function () {
			$('#slashHistory table tr th').removeClass('mouseenterSlash');
			$(this).removeClass('mouseleaveSlash').addClass('mouseenterSlash');
		},
		mouseleave: function () {
			$(this).removeClass('mouseenterSlash').addClass('mouseleaveSlash');
		},
		click: function() {
			addFilesJSON($(this).children('label').text());
			way = [];
			way[0] = 'server';
			for(var i = 0; i < $('#slashHistory table tr').index($(this).parent('tr')) + 1; i++) {
				way.push($('#slashHistory table tr').eq(i).children('th').children('label').text());
			}
			PrintSlashURL(way);
		}
		
	},'#slashHistory table tr th');
	// Events with SlashHistory Done!
	
	// Reset Clicks Script
	$('body').on('click', function(event) {
		$('body #wrapper #board #files .fileTR').removeClass('mouseenter mouseenterP mouseclick mouseclickP').addClass('mouseleave').children('th').children('label').removeClass('light').addClass('dark');
		$('#slashHistory').slideUp(300);
	});
	// Reset Clicks Script Done!
	
	// LiteStack Logo Click Event
	$('#liteStackLogo').on('click', function() {
		document.location.reload(true);
	});
	// LiteStack Logo Click Event Done!
	
	// ToolTip Script
	$('.Mtooltip').on({
		mouseenter: function () {
            // Hover over code
            var title = $(this).attr('title');
            $(this).data('tipText', title).removeAttr('title');
            $('<p class="tooltip text"></p>')
            .text(title)
            .appendTo('body')
            .fadeIn('slow');
        },
		mouseleave: function () {
                // Hover out code
                $(this).attr('title', $(this).data('tipText'));
                $('.tooltip').remove();
        },
		mousemove: function (e) {
                var mousex = e.pageX + 20; //Get X coordinates
                var mousey = e.pageY + 10; //Get Y coordinates
                $('.tooltip')
                .css({ top: mousey, left: mousex })
        }
	});
	// ToolTip Script Done!
});